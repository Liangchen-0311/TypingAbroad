"use strict";

const { toMembershipSnapshot } = require("./membership");

function throwDatabaseError(operation, error) {
  if (!error) return;
  const message = typeof error.message === "string" ? error.message : "unknown database error";
  throw new Error(`${operation}: ${message}`);
}

function mapOrder(record) {
  if (!record) return null;
  return {
    orderId: record.order_id,
    uid: record.uid,
    planId: record.plan_id,
    provider: record.provider,
    amountFen: record.amount_fen,
    currency: record.currency,
    status: record.status,
    alipayTradeNo: record.alipay_trade_no ?? null,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    paidAt: record.paid_at ?? null,
  };
}

function mapMembership(record) {
  if (!record) return null;
  return {
    tier: record.tier,
    planId: record.plan_id,
    expiresAt: record.expires_at,
  };
}

function createStore(db) {
  return {
    async createOrder(order) {
      const { error } = await db.from("payment_orders").insert({
        order_id: order.orderId,
        uid: order.uid,
        plan_id: order.planId,
        provider: order.provider,
        amount_fen: order.amountFen,
        currency: order.currency,
        status: order.status,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
      });
      throwDatabaseError("CREATE_ORDER_FAILED", error);
    },

    async getOrder(orderId) {
      const { data, error } = await db
        .from("payment_orders")
        .select("*")
        .eq("order_id", orderId)
        .limit(1)
        .maybeSingle();
      throwDatabaseError("GET_ORDER_FAILED", error);
      return mapOrder(data);
    },

    async getMembership(uid) {
      const { data, error } = await db
        .from("memberships")
        .select("tier,plan_id,expires_at")
        .eq("uid", uid)
        .limit(1)
        .maybeSingle();
      throwDatabaseError("GET_MEMBERSHIP_FAILED", error);
      return toMembershipSnapshot(mapMembership(data));
    },

    async activateOrder({ orderId, tradeNo, eventId, paidAt }) {
      const { data, error } = await db.rpc("activate_membership_order", {
        p_order_id: orderId,
        p_trade_no: tradeNo,
        p_event_id: eventId,
        p_paid_at: paidAt.toISOString(),
      });
      throwDatabaseError("ACTIVATE_ORDER_FAILED", error);
      return data;
    },
  };
}

module.exports = { createStore, mapMembership, mapOrder, throwDatabaseError };
