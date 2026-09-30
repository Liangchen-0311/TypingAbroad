"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { gzipSync } = require("node:zlib");
const {
  createOrderId,
  eventIdFor,
  eventIdForQuery,
  orderIsExpired,
  parseAlipayPaidAt,
  reconcilePendingOrder,
} = require("../src/app");
const { buildMembershipUpdate, toMembershipSnapshot } = require("../src/membership");
const { formatAmount, getPlan, parseAmountToFen } = require("../src/plans");
const { parseCloudbaseUser } = require("../src/request");

test("server plan catalogue owns the charged amounts", () => {
  assert.equal(getPlan("half-year").amountFen, 2660);
  assert.equal(getPlan("lifetime").amountFen, 26600);
  assert.equal(getPlan("other"), null);
  assert.equal(formatAmount(2660), "26.60");
});

test("Alipay decimal amounts are parsed without floating point rounding", () => {
  assert.equal(parseAmountToFen("26.60"), 2660);
  assert.equal(parseAmountToFen("266"), 26600);
  assert.equal(parseAmountToFen("26.600"), null);
  assert.equal(parseAmountToFen("-1.00"), null);
});

test("order and event identifiers are stable safe values", () => {
  const orderId = createOrderId(new Date("2026-09-29T00:00:00.000Z"));
  assert.match(orderId, /^TA20260929[0-9a-f]{24}$/);
  const input = { notify_id: "n1", trade_no: "t1", out_trade_no: orderId, trade_status: "TRADE_SUCCESS" };
  assert.equal(eventIdFor(input), eventIdFor(input));
  assert.match(eventIdFor(input), /^[0-9a-f]{64}$/);
  assert.match(eventIdForQuery({ orderId, tradeNo: "t1", tradeStatus: "TRADE_SUCCESS" }), /^[0-9a-f]{64}$/);
});

test("Alipay timestamps are interpreted in China Standard Time", () => {
  const fallback = new Date("2026-09-30T08:00:00.000Z");
  assert.equal(parseAlipayPaidAt("2026-09-30 15:51:24", fallback).toISOString(), "2026-09-30T07:51:24.000Z");
  assert.equal(parseAlipayPaidAt("invalid", fallback), fallback);
  assert.equal(orderIsExpired({ createdAt: "2026-09-30T07:00:00.000Z" }, fallback), true);
});

test("active Alipay query compensates a missed callback and activates membership", async () => {
  const pending = {
    orderId: "TA20260930querycompensation",
    uid: "user-1",
    provider: "alipay",
    amountFen: 2660,
    status: "pending",
    createdAt: "2026-09-30T07:40:00.000Z",
  };
  let activation = null;
  const store = {
    async activateOrder(input) { activation = input; },
    async getOrder() { return { ...pending, status: "paid" }; },
  };
  const alipay = {
    async exec(method, params, options) {
      assert.equal(method, "alipay.trade.query");
      assert.deepEqual(params, { bizContent: { outTradeNo: pending.orderId } });
      assert.deepEqual(options, { validateSign: true });
      return {
        code: "10000",
        outTradeNo: pending.orderId,
        tradeNo: "2026093022000000000001",
        tradeStatus: "TRADE_SUCCESS",
        totalAmount: "26.60",
        sellerId: "seller-1",
        sendPayDate: "2026-09-30 15:51:24",
      };
    },
  };

  const result = await reconcilePendingOrder({
    order: pending,
    store,
    alipay,
    config: { alipaySellerId: "seller-1" },
    at: new Date("2026-09-30T08:00:00.000Z"),
  });

  assert.equal(result.status, "paid");
  assert.equal(activation.orderId, pending.orderId);
  assert.equal(activation.tradeNo, "2026093022000000000001");
  assert.equal(activation.paidAt.toISOString(), "2026-09-30T07:51:24.000Z");
});

test("active query refuses to activate an order when the amount differs", async () => {
  const pending = {
    orderId: "TA20260930amountmismatch",
    amountFen: 2660,
    status: "pending",
    createdAt: "2026-09-30T07:40:00.000Z",
  };
  let activated = false;
  await assert.rejects(
    reconcilePendingOrder({
      order: pending,
      store: {
        async activateOrder() { activated = true; },
      },
      alipay: {
        async exec() {
          return {
            code: "10000",
            outTradeNo: pending.orderId,
            tradeNo: "trade-1",
            tradeStatus: "TRADE_SUCCESS",
            totalAmount: "0.01",
          };
        },
      },
      config: { alipaySellerId: "" },
      at: new Date("2026-09-30T08:00:00.000Z"),
    }),
    /ALIPAY_QUERY_AMOUNT_MISMATCH/,
  );
  assert.equal(activated, false);
});

test("expired Alipay orders that do not exist are closed locally", async () => {
  const pending = {
    orderId: "TA20260930expiredorder",
    status: "pending",
    createdAt: "2026-09-30T06:00:00.000Z",
  };
  let closed = false;
  const result = await reconcilePendingOrder({
    order: pending,
    store: {
      async closeOrder() { closed = true; },
      async getOrder() { return { ...pending, status: "closed" }; },
    },
    alipay: {
      async exec() { return { code: "40004", subCode: "ACQ.TRADE_NOT_EXIST" }; },
    },
    config: { alipaySellerId: "" },
    at: new Date("2026-09-30T08:00:00.000Z"),
  });
  assert.equal(closed, true);
  assert.equal(result.status, "closed");
});

test("CloudBase user context supports plain and gzip-compressed payloads", () => {
  const plain = Buffer.from(JSON.stringify({ uid: "plain-user-123" })).toString("base64");
  const compressed = gzipSync(JSON.stringify({ userId: "compressed-user-456" })).toString("base64");

  assert.deepEqual(parseCloudbaseUser({ headers: { "x-cloudbase-context": plain } }), {
    uid: "plain-user-123",
  });
  assert.deepEqual(parseCloudbaseUser({ headers: { "x-cloudbase-context": compressed } }), {
    uid: "compressed-user-456",
  });
  assert.equal(parseCloudbaseUser({ headers: { "x-cloudbase-context": "not-valid-context" } }), null);
});

test("six-month purchases extend an active membership", () => {
  const current = {
    tier: "member",
    planId: "half-year",
    expiresAt: "2026-12-31T10:30:00.000Z",
    activatedAt: "2026-06-30T10:30:00.000Z",
  };
  const updated = buildMembershipUpdate({
    current,
    planId: "half-year",
    orderId: "TAORDER",
    now: new Date("2026-09-29T10:30:00.000Z"),
  });
  assert.equal(updated.expiresAt, "2027-06-30T10:30:00.000Z");
});

test("lifetime membership cannot be downgraded", () => {
  const updated = buildMembershipUpdate({
    current: { tier: "member", planId: "lifetime", expiresAt: null, sourceOrderId: "original" },
    planId: "half-year",
    orderId: "later",
    now: new Date("2026-09-29T10:30:00.000Z"),
  });
  assert.equal(updated.planId, "lifetime");
  assert.equal(updated.expiresAt, null);
  assert.equal(updated.sourceOrderId, "original");
});

test("expired records resolve to free access", () => {
  const snapshot = toMembershipSnapshot(
    { tier: "member", planId: "half-year", expiresAt: "2026-01-01T00:00:00.000Z" },
    new Date("2026-09-29T00:00:00.000Z"),
  );
  assert.deepEqual(snapshot, { tier: "free" });
});
