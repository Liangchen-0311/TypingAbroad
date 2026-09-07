import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutPanel } from "@/components/CheckoutPanel";

export const metadata: Metadata = {
  title: "Secure Checkout",
  description: "Review a TypeAbroad membership order and continue to Alipay.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="checkout-page page-shell">
      <Suspense fallback={<div className="checkout-loading" aria-busy="true">Preparing checkout…</div>}>
        <CheckoutPanel />
      </Suspense>
    </div>
  );
}
