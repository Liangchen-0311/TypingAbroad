"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Clock3, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMembership } from "./MembershipProvider";
import { getPaymentOrderStatus, paymentIsConfigured, type PaymentOrderStatus } from "@/lib/paymentClient";

type ResultState = PaymentOrderStatus | "checking" | "unavailable" | "missing";

export function PaymentResultPanel() {
  const searchParams = useSearchParams();
  const orderId = (searchParams.get("order_id") ?? searchParams.get("out_trade_no"))?.trim() ?? "";
  const [state, setState] = useState<ResultState>(orderId ? "checking" : "missing");
  const { refreshMembership } = useMembership();

  const checkOrder = useCallback(async () => {
    if (!orderId) {
      setState("missing");
      return;
    }
    if (!paymentIsConfigured()) {
      setState("unavailable");
      return;
    }
    setState("checking");
    try {
      const nextState = await getPaymentOrderStatus(orderId);
      setState(nextState);
      if (nextState === "paid") await refreshMembership();
    } catch {
      setState("unavailable");
    }
  }, [orderId, refreshMembership]);

  useEffect(() => {
    void checkOrder();
  }, [checkOrder]);

  const paid = state === "paid";
  const pending = state === "pending" || state === "checking";

  return (
    <section className="payment-result" aria-live="polite">
      {paid ? <CheckCircle2 aria-hidden="true" /> : pending ? <Clock3 aria-hidden="true" /> : <CircleAlert aria-hidden="true" />}
      <span>{paid ? "Payment confirmed" : pending ? "Verifying payment" : "Payment status"}</span>
      <h1>
        {paid
          ? "Your membership is active."
          : pending
            ? "We’re checking the order."
            : state === "missing"
              ? "No order was provided."
              : state === "failed" || state === "closed"
                ? "The order was not completed."
                : "Status is temporarily unavailable."}
      </h1>
      <p>
        {paid
          ? "You can now return to practice with full member access."
          : "Membership is never activated from a browser redirect alone. We wait for the verified payment result from the server."}
      </p>
      {orderId && <small>Order {orderId}</small>}
      <div className="payment-result__actions">
        {paid ? (
          <Link className="primary-button" href="/practice">Start practising <ArrowRight aria-hidden="true" /></Link>
        ) : (
          <button className="secondary-button" type="button" onClick={() => void checkOrder()} disabled={state === "checking"}>
            <RefreshCw aria-hidden="true" /> {state === "checking" ? "Checking…" : "Check again"}
          </button>
        )}
        <Link className="text-button" href="/membership">Back to membership</Link>
      </div>
    </section>
  );
}
