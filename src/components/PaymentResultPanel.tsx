"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Clock3, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMembership } from "./MembershipProvider";
import { useAccount } from "./AccountProvider";
import { getPaymentOrderStatus, paymentIsConfigured, type PaymentOrderStatus } from "@/lib/paymentClient";

type ResultState = PaymentOrderStatus | "checking" | "unavailable" | "missing";

export function PaymentResultPanel() {
  const searchParams = useSearchParams();
  const orderId = (searchParams.get("order_id") ?? searchParams.get("out_trade_no"))?.trim() ?? "";
  const [state, setState] = useState<ResultState>(orderId ? "checking" : "missing");
  const automaticChecks = useRef(0);
  const { refreshMembership } = useMembership();
  const { user, loading: accountLoading, getAuthHeaders, openAccount } = useAccount();

  const checkOrder = useCallback(async () => {
    if (!orderId) {
      setState("missing");
      return;
    }
    if (!paymentIsConfigured()) {
      setState("unavailable");
      return;
    }
    if (accountLoading) return;
    if (!user) {
      setState("unavailable");
      return;
    }
    setState("checking");
    try {
      const authHeaders = await getAuthHeaders();
      const nextState = await getPaymentOrderStatus(orderId, authHeaders);
      setState(nextState);
      if (nextState === "paid") await refreshMembership();
    } catch {
      setState("unavailable");
    }
  }, [accountLoading, getAuthHeaders, orderId, refreshMembership, user]);

  useEffect(() => {
    void checkOrder();
  }, [checkOrder]);

  useEffect(() => {
    if (state !== "pending" || automaticChecks.current >= 12) return;
    const timer = window.setTimeout(() => {
      automaticChecks.current += 1;
      void checkOrder();
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [checkOrder, state]);

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
          : "We verify the signed Alipay callback and actively query Alipay when needed. You can keep this page open while the order is reconciled."}
      </p>
      {orderId && <small>Order {orderId}</small>}
      <div className="payment-result__actions">
        {paid ? (
          <>
            <Link className="primary-button" href="/library">Open full essay library <ArrowRight aria-hidden="true" /></Link>
            <Link className="secondary-button" href="/words">Practise all word categories</Link>
          </>
        ) : (
          user ? (
            <button className="secondary-button" type="button" onClick={() => {
              automaticChecks.current = 0;
              void checkOrder();
            }} disabled={state === "checking"}>
              <RefreshCw aria-hidden="true" /> {state === "checking" ? "Checking…" : "Check again"}
            </button>
          ) : (
            <button className="secondary-button" type="button" onClick={openAccount}>Sign in to check</button>
          )
        )}
        <Link className="text-button" href="/membership">Back to membership</Link>
      </div>
    </section>
  );
}
