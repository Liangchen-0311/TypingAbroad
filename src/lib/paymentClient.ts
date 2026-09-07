import type { MembershipPlanId } from "./membership";

export interface CreatePaymentOrderInput {
  planId: MembershipPlanId;
  mobile: string;
  returnUrl: string;
}

export interface PaymentOrder {
  orderId: string;
  checkoutUrl: string;
}

export type PaymentOrderStatus = "pending" | "paid" | "failed" | "closed";

const paymentApiBase = process.env.NEXT_PUBLIC_PAYMENT_API_BASE?.replace(/\/$/, "") ?? "";

export function paymentIsConfigured() {
  return Boolean(paymentApiBase);
}

function isPaymentOrder(value: unknown): value is PaymentOrder {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PaymentOrder>;
  return typeof candidate.orderId === "string" && typeof candidate.checkoutUrl === "string";
}

export async function createAlipayOrder(input: CreatePaymentOrderInput) {
  if (!paymentApiBase) throw new Error("PAYMENT_NOT_CONFIGURED");
  const response = await fetch(`${paymentApiBase}/v1/orders/alipay`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("ORDER_CREATION_FAILED");
  const payload: unknown = await response.json();
  if (!isPaymentOrder(payload)) throw new Error("INVALID_ORDER_RESPONSE");

  const checkoutUrl = new URL(payload.checkoutUrl);
  if (checkoutUrl.protocol !== "https:") throw new Error("INVALID_CHECKOUT_URL");
  return payload;
}

export async function getPaymentOrderStatus(orderId: string) {
  if (!paymentApiBase) throw new Error("PAYMENT_NOT_CONFIGURED");
  const response = await fetch(`${paymentApiBase}/v1/orders/${encodeURIComponent(orderId)}/status`, {
    credentials: "include",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("ORDER_STATUS_FAILED");
  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object") throw new Error("INVALID_ORDER_STATUS");
  const status = (payload as { status?: unknown }).status;
  if (status !== "pending" && status !== "paid" && status !== "failed" && status !== "closed") {
    throw new Error("INVALID_ORDER_STATUS");
  }
  return status as PaymentOrderStatus;
}
