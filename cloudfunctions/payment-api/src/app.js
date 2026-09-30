"use strict";

const crypto = require("node:crypto");
const { formatAmount, getPlan, parseAmountToFen } = require("./plans");
const {
  HttpError,
  parseCloudbaseUser,
  parseForm,
  readBody,
  readJson,
  requestPath,
  sendJson,
  sendText,
} = require("./request");

function createOrderId(now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `TA${date}${crypto.randomBytes(12).toString("hex")}`;
}

function eventIdFor(params) {
  const basis = [params.notify_id, params.trade_no, params.out_trade_no, params.trade_status]
    .filter(Boolean)
    .join(":");
  return crypto.createHash("sha256").update(basis).digest("hex");
}

function eventIdForQuery({ orderId, tradeNo, tradeStatus }) {
  return crypto
    .createHash("sha256")
    .update(`query:${orderId}:${tradeNo}:${tradeStatus}`)
    .digest("hex");
}

function parseAlipayPaidAt(value, fallback) {
  if (typeof value !== "string") return fallback;
  const match = value.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/);
  if (!match) return fallback;
  const parsed = new Date(`${match[1]}T${match[2]}+08:00`);
  return Number.isFinite(parsed.getTime()) ? parsed : fallback;
}

function orderIsExpired(order, at) {
  const createdAt = new Date(order.createdAt);
  return Number.isFinite(createdAt.getTime()) && at.getTime() - createdAt.getTime() > 35 * 60 * 1000;
}

async function reconcilePendingOrder({ order, store, alipay, config, at = new Date() }) {
  if (!order || order.status !== "pending") return order;

  const result = await alipay.exec(
    "alipay.trade.query",
    { bizContent: { outTradeNo: order.orderId } },
    { validateSign: true },
  );
  const code = typeof result?.code === "string" ? result.code : "";
  const subCode = typeof result?.subCode === "string" ? result.subCode : "";

  if (code !== "10000") {
    if (subCode === "ACQ.TRADE_NOT_EXIST" && orderIsExpired(order, at)) {
      await store.closeOrder({ orderId: order.orderId, closedAt: at });
      return await store.getOrder(order.orderId);
    }
    return order;
  }

  if (result.outTradeNo !== order.orderId) throw new Error("ALIPAY_QUERY_ORDER_MISMATCH");
  const tradeStatus = typeof result.tradeStatus === "string" ? result.tradeStatus : "";

  if (tradeStatus === "TRADE_CLOSED") {
    await store.closeOrder({ orderId: order.orderId, closedAt: at });
    return await store.getOrder(order.orderId);
  }
  if (tradeStatus !== "TRADE_SUCCESS" && tradeStatus !== "TRADE_FINISHED") return order;

  const tradeNo = typeof result.tradeNo === "string" ? result.tradeNo : "";
  if (!tradeNo) throw new Error("ALIPAY_QUERY_TRADE_NUMBER_MISSING");
  if (parseAmountToFen(String(result.totalAmount ?? "")) !== order.amountFen) {
    throw new Error("ALIPAY_QUERY_AMOUNT_MISMATCH");
  }
  if (config.alipaySellerId && result.sellerId && result.sellerId !== config.alipaySellerId) {
    throw new Error("ALIPAY_QUERY_SELLER_MISMATCH");
  }

  await store.activateOrder({
    orderId: order.orderId,
    tradeNo,
    eventId: eventIdForQuery({ orderId: order.orderId, tradeNo, tradeStatus }),
    paidAt: parseAlipayPaidAt(result.sendPayDate, at),
  });
  return await store.getOrder(order.orderId);
}

function requireUser(req) {
  const user = parseCloudbaseUser(req);
  if (!user) throw new HttpError(401, "AUTH_REQUIRED", "Please sign in first.");
  return user;
}

function createApplication({ store, alipay, config, now = () => new Date() }) {
  const createCheckoutUrl = ({ orderId, plan }) => alipay.pageExecute("alipay.trade.page.pay", "GET", {
    notifyUrl: `${config.siteUrl}/api/v1/payments/alipay/notify`,
    returnUrl: `${config.siteUrl}/payment/result?order_id=${encodeURIComponent(orderId)}`,
    bizContent: {
      outTradeNo: orderId,
      productCode: "FAST_INSTANT_TRADE_PAY",
      totalAmount: formatAmount(plan.amountFen),
      subject: plan.name,
      timeoutExpress: "30m",
    },
  });

  async function handleNotification(req, res) {
    const rawBody = await readBody(req);
    const params = parseForm(rawBody);

    if (!alipay.checkNotifySignV2(params)) {
      sendText(res, 400, "failure");
      return;
    }
    if (params.app_id !== config.alipayAppId) {
      sendText(res, 400, "failure");
      return;
    }
    if (config.alipaySellerId && params.seller_id !== config.alipaySellerId) {
      sendText(res, 400, "failure");
      return;
    }
    if (params.trade_status !== "TRADE_SUCCESS" && params.trade_status !== "TRADE_FINISHED") {
      sendText(res, 200, "success");
      return;
    }
    if (!params.out_trade_no || !params.trade_no) {
      sendText(res, 400, "failure");
      return;
    }

    const order = await store.getOrder(params.out_trade_no);
    if (!order || order.provider !== "alipay" || parseAmountToFen(params.total_amount) !== order.amountFen) {
      sendText(res, 400, "failure");
      return;
    }

    await store.activateOrder({
      orderId: order.orderId,
      tradeNo: params.trade_no,
      eventId: eventIdFor(params),
      paidAt: now(),
    });
    sendText(res, 200, "success");
  }

  async function reconcileWithoutBlocking(order, context) {
    if (!order || order.status !== "pending") return order;
    try {
      return await reconcilePendingOrder({ order, store, alipay, config, at: now() });
    } catch (error) {
      console.error("Alipay order reconciliation failed", {
        context,
        orderId: order.orderId,
        error: error instanceof Error ? error.message : "unknown",
      });
      return order;
    }
  }

  return async function application(req, res) {
    const path = requestPath(req);
    try {
      if (req.method === "GET" && (path === "/health" || path === "/")) {
        sendJson(res, 200, { ok: true, service: "typeabroad-payment-api" });
        return;
      }

      if (req.method === "POST" && path === "/v1/payments/alipay/notify") {
        await handleNotification(req, res);
        return;
      }

      if (req.method === "GET" && path === "/v1/me/membership") {
        const { uid } = requireUser(req);
        const pendingOrder = await store.getLatestPendingOrder(uid);
        await reconcileWithoutBlocking(pendingOrder, "membership");
        sendJson(res, 200, await store.getMembership(uid));
        return;
      }

      if (req.method === "POST" && path === "/v1/orders/alipay") {
        const { uid } = requireUser(req);
        const payload = await readJson(req);
        const plan = getPlan(payload.planId);
        if (!plan) throw new HttpError(400, "INVALID_PLAN", "Unknown membership plan.");

        const createdAt = now();
        const orderId = createOrderId(createdAt);
        const checkoutUrl = createCheckoutUrl({ orderId, plan });
        const parsedCheckoutUrl = new URL(checkoutUrl);
        if (parsedCheckoutUrl.protocol !== "https:" || parsedCheckoutUrl.hostname !== "openapi.alipay.com") {
          throw new Error("INVALID_ALIPAY_CHECKOUT_URL");
        }

        await store.createOrder({
          orderId,
          uid,
          planId: plan.id,
          provider: "alipay",
          amountFen: plan.amountFen,
          currency: "CNY",
          status: "pending",
          createdAt: createdAt.toISOString(),
          updatedAt: createdAt.toISOString(),
        });
        sendJson(res, 201, { orderId, checkoutUrl });
        return;
      }

      const statusMatch = req.method === "GET" && path.match(/^\/v1\/orders\/([A-Za-z0-9_-]{8,64})\/status$/);
      if (statusMatch) {
        const { uid } = requireUser(req);
        let order = await store.getOrder(statusMatch[1]);
        if (!order || order.uid !== uid) throw new HttpError(404, "ORDER_NOT_FOUND", "Order not found.");
        order = await reconcileWithoutBlocking(order, "order-status");
        sendJson(res, 200, { orderId: order.orderId, status: order.status });
        return;
      }

      throw new HttpError(404, "NOT_FOUND", "Route not found.");
    } catch (error) {
      if (error instanceof HttpError) {
        sendJson(res, error.status, { error: error.code, message: error.message });
        return;
      }
      console.error("payment-api request failed", {
        path,
        method: req.method,
        error: error instanceof Error ? error.message : "unknown",
      });
      if (!res.headersSent) sendJson(res, 500, { error: "INTERNAL_ERROR", message: "Request failed." });
      else res.end();
    }
  };
}

module.exports = {
  createApplication,
  createOrderId,
  eventIdFor,
  eventIdForQuery,
  orderIsExpired,
  parseAlipayPaidAt,
  reconcilePendingOrder,
};
