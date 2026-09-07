import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentResultPanel } from "@/components/PaymentResultPanel";

export const metadata: Metadata = {
  title: "Payment Result",
  robots: { index: false, follow: false },
};

export default function PaymentResultPage() {
  return (
    <div className="payment-result-page page-shell">
      <Suspense fallback={<div className="checkout-loading" aria-busy="true">Checking payment…</div>}>
        <PaymentResultPanel />
      </Suspense>
    </div>
  );
}
