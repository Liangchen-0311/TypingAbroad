"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { COMPANY_NAME, SITE_URL } from "@/lib/constants";
import { formatPrice, getMembershipPlan } from "@/lib/membership";
import { createAlipayOrder, paymentIsConfigured } from "@/lib/paymentClient";

type SubmitState = "idle" | "loading" | "error";

function validMainlandMobile(value: string) {
  return /^1[3-9]\d{9}$/.test(value);
}

export function CheckoutPanel() {
  const searchParams = useSearchParams();
  const plan = useMemo(() => getMembershipPlan(searchParams.get("plan")), [searchParams]);
  const [mobile, setMobile] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const configured = paymentIsConfigured();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedMobile = mobile.trim();
    if (!validMainlandMobile(normalizedMobile)) {
      setState("error");
      setMessage("请输入有效的中国大陆手机号码，以便支付后绑定会员权益。");
      return;
    }
    if (!accepted) {
      setState("error");
      setMessage("请先阅读并同意服务条款、隐私政策和退款规则。");
      return;
    }
    if (!configured) {
      setState("error");
      setMessage("支付宝线上支付正在接入审核中，当前不会提交手机号或产生扣款。");
      return;
    }

    setState("loading");
    setMessage("");
    try {
      const order = await createAlipayOrder({
        planId: plan.id,
        mobile: normalizedMobile,
        returnUrl: `${SITE_URL}/payment/result`,
      });
      window.location.assign(order.checkoutUrl);
    } catch {
      setState("error");
      setMessage("暂时无法创建订单，请稍后重试。系统没有产生扣款。");
    }
  };

  return (
    <div className="checkout-layout">
      <section className="checkout-order" aria-labelledby="checkout-order-title">
        <Link className="text-link" href="/membership"><ArrowLeft aria-hidden="true" /> Change plan</Link>
        <div>
          <span className="checkout-kicker">Order summary</span>
          <h1 id="checkout-order-title">{plan.name}</h1>
          <p>{plan.nameZh} · {plan.durationZh}</p>
        </div>
        <dl>
          <div><dt>Current offer</dt><dd>{formatPrice(plan.price)}</dd></div>
          <div><dt>Original price</dt><dd><s>{formatPrice(plan.originalPrice)}</s></dd></div>
          <div className="checkout-order__total"><dt>Total</dt><dd>{formatPrice(plan.price)}</dd></div>
        </dl>
        <div className="checkout-assurances">
          <p><Check aria-hidden="true" /> One-time payment. No automatic renewal.</p>
          <p><ShieldCheck aria-hidden="true" /> Membership opens only after server-side payment confirmation.</p>
        </div>
      </section>

      <section className="checkout-payment" aria-labelledby="checkout-payment-title">
        <div className="checkout-payment__heading">
          <span>Secure checkout</span>
          <h2 id="checkout-payment-title">Continue with Alipay</h2>
          <p>付款成功后，会员权益将绑定到下方手机号。支付宝支付状态由服务端回调确认。</p>
        </div>

        {!configured && (
          <div className="payment-review-notice" role="status">
            <span>Payment review mode</span>
            <p>支付宝线上支付接口正在申请中。此页面可用于服务审核，目前不会收集信息或发起付款。</p>
          </div>
        )}

        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="checkout-mobile">
            <span>会员绑定手机号</span>
            <input
              id="checkout-mobile"
              name="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={mobile}
              aria-invalid={state === "error" && !validMainlandMobile(mobile.trim())}
              aria-describedby="checkout-helper"
              onChange={(event) => {
                setMobile(event.target.value.replace(/\D/g, "").slice(0, 11));
                if (state === "error") {
                  setState("idle");
                  setMessage("");
                }
              }}
              placeholder="138 0000 0000"
            />
          </label>
          <p id="checkout-helper" className="checkout-form__helper">用于开通和找回会员权益，不会展示给其他用户。</p>

          <label className="checkout-consent">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => {
                setAccepted(event.target.checked);
                if (state === "error") {
                  setState("idle");
                  setMessage("");
                }
              }}
            />
            <span>我已阅读并同意 <Link href="/terms">服务条款</Link>、<Link href="/privacy">隐私政策</Link> 与 <Link href="/refund">退款规则</Link>。</span>
          </label>

          <button className="primary-button checkout-submit" type="submit" data-state={state} disabled={state === "loading"}>
            {state === "loading" ? "Creating order…" : configured ? "Continue to Alipay" : "Payment opening soon"}
            {state !== "loading" && <ArrowRight aria-hidden="true" />}
          </button>
          <div className="checkout-form__message" aria-live="polite">
            {message && <p className="is-error"><LockKeyhole aria-hidden="true" /> {message}</p>}
          </div>
        </form>

        <footer className="checkout-merchant">
          <span>Service provider</span>
          <strong>{COMPANY_NAME}</strong>
          <a href="mailto:hello@typeabroad.com">hello@typeabroad.com</a>
        </footer>
      </section>
    </div>
  );
}
