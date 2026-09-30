"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, MonitorUp, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { COMPANY_NAME } from "@/lib/constants";
import { MEMBER_PLAN_FEATURES_ZH, formatPrice, getMembershipPlan } from "@/lib/membership";
import { createAlipayOrder, PaymentApiError, paymentIsConfigured } from "@/lib/paymentClient";
import { useAccount } from "./AccountProvider";

type SubmitState = "idle" | "loading" | "error";

export function CheckoutPanel() {
  const searchParams = useSearchParams();
  const plan = useMemo(() => getMembershipPlan(searchParams.get("plan")), [searchParams]);
  const [accepted, setAccepted] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const configured = paymentIsConfigured();
  const { user, loading: accountLoading, openAccount, getAuthHeaders } = useAccount();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setState("error");
      setMessage("请先登录或注册账号，再继续付款。会员权益会自动绑定到这个账号。");
      openAccount();
      return;
    }
    if (!accepted) {
      setState("error");
      setMessage("请先确认会员将在付款后立即开通，并阅读服务条款、隐私政策和售后规则。");
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
      const authHeaders = await getAuthHeaders();
      const order = await createAlipayOrder({ planId: plan.id }, authHeaders);
      window.location.assign(order.checkoutUrl);
    } catch (error) {
      setState("error");
      if (error instanceof PaymentApiError && error.status === 401) {
        setMessage("登录状态已过期，请重新登录后再继续付款。系统没有产生扣款。");
        openAccount();
      } else {
        const reference = error instanceof PaymentApiError && error.requestId
          ? ` 参考编号：${error.requestId}`
          : "";
        setMessage(`暂时无法创建订单，请稍后重试。系统没有产生扣款。${reference}`);
      }
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
          <p><LockKeyhole aria-hidden="true" /> 付款成功后会员立即开通；数字会员权益开通后不支持无理由退款。</p>
        </div>
        <div className="checkout-unlocks">
          <span>Included after payment</span>
          <ul>
            {MEMBER_PLAN_FEATURES_ZH.map((feature) => <li key={feature}><Check aria-hidden="true" /> {feature}</li>)}
          </ul>
          <small>付款成功并由服务器确认后，上述权限会自动绑定到当前手机号账号。</small>
        </div>
      </section>

      <section className="checkout-payment" aria-labelledby="checkout-payment-title">
        <div className="checkout-payment__heading">
          <span>Secure checkout</span>
          <h2 id="checkout-payment-title">Continue with Alipay</h2>
          <p>付款成功后，会员权益会自动绑定到当前 TypeAbroad 账号。支付状态由服务端安全确认。</p>
        </div>

        {!configured && (
          <div className="payment-review-notice" role="status">
            <span>Payment review mode</span>
            <p>支付宝线上支付接口正在申请中。此页面可用于服务审核，目前不会收集信息或发起付款。</p>
          </div>
        )}

        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <div className={`checkout-account${user ? " is-signed-in" : ""}`}>
            <UserRound aria-hidden="true" />
            <div>
              <span>{user ? "Account ready" : "Account required"}</span>
              <strong>{accountLoading ? "Checking account…" : user ? "会员将绑定到当前账号" : "请先登录或注册"}</strong>
            </div>
            <button className="text-button" type="button" onClick={openAccount}>{user ? "View account" : "Sign in"}</button>
          </div>

          <div className="checkout-device-note">
            <MonitorUp aria-hidden="true" />
            <p><strong>请在电脑上完成付款。</strong><span>当前已开通支付宝电脑网站支付，进入支付宝后可扫码或按页面提示付款。</span></p>
          </div>

          <div className="checkout-final-sale" role="note">
            <LockKeyhole aria-hidden="true" />
            <p>
              <strong>付款前请确认会员方案。</strong>
              <span>付款成功后会员权益会立即开通。数字化会员服务开通后不支持无理由退款；重复扣款、未成功开通、法律法规另有规定或平台无法正常提供服务的情况除外。</span>
            </p>
          </div>

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
            <span>我已确认会员方案与金额，并知悉付款成功后将立即开通、开通后不支持无理由退款；同时同意 <Link href="/terms">服务条款</Link>、<Link href="/privacy">隐私政策</Link> 与 <Link href="/refund">售后规则</Link>。</span>
          </label>

          <button className="primary-button checkout-submit" type="submit" data-state={state} disabled={state === "loading" || accountLoading}>
            {state === "loading" ? "Creating order…" : configured ? "同意并前往支付宝" : "Payment opening soon"}
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
