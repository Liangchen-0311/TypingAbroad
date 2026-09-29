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
        const order = await store.getOrder(statusMatch[1]);
        if (!order || order.uid !== uid) throw new HttpError(404, "ORDER_NOT_FOUND", "Order not found.");
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

module.exports = { createApplication, createOrderId, eventIdFor };
