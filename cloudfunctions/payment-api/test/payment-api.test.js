"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { gzipSync } = require("node:zlib");
const { createOrderId, eventIdFor } = require("../src/app");
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
