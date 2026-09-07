import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { COMPANY_NAME } from "@/lib/constants";
import {
  FREE_PLAN_FEATURES,
  MEMBER_PLAN_FEATURES,
  MEMBERSHIP_ACCESS_MODE,
  MEMBERSHIP_PLANS,
  formatPrice,
} from "@/lib/membership";

export const metadata: Metadata = {
  title: "Membership",
  description: "Compare TypeAbroad free and member access for IELTS and TOEFL typing practice.",
  alternates: { canonical: "/membership" },
};

const comparison = [
  ["Essay practice", "6 selected samples", "Complete model essay library"],
  ["Word practice", "2 categories · 10 words", "1,000+ words · every category"],
  ["Mistake review", "Up to 10 words", "Unlimited context recall"],
  ["Progress", "Latest 7 results", "Complete device history"],
] as const;

export default function MembershipPage() {
  const halfYear = MEMBERSHIP_PLANS["half-year"];
  const lifetime = MEMBERSHIP_PLANS.lifetime;

  return (
    <div className="membership-page page-shell">
      <header className="membership-hero">
        <div className="membership-hero__price">
          <span>Limited offer · 半年会员限时优享</span>
          <p><small>¥</small>{halfYear.price}</p>
          <s>{formatPrice(halfYear.originalPrice)}</s>
        </div>
        <div className="membership-hero__copy">
          <h1>Practise without limits.</h1>
          <p>Unlock the full library of high-scoring IELTS and TOEFL model essays, 1,000+ academic words, and deeper mistake review.</p>
          <Link className="primary-button" href="/checkout?plan=half-year">Choose six months <ArrowRight aria-hidden="true" /></Link>
          <small>一次付费 · 无自动续费 · 支付成功后自动开通</small>
        </div>
      </header>

      {MEMBERSHIP_ACCESS_MODE === "preview" && (
        <aside className="membership-preview-note">
          <span>Open preview</span>
          <p>支付服务准备期间，所有现有练习内容继续开放。支付正式上线后才会启用下方免费/会员限制。</p>
        </aside>
      )}

      <section className="membership-plans" aria-labelledby="membership-plans-title">
        <div className="membership-section-heading">
          <h2 id="membership-plans-title">Choose your access.</h2>
          <p>Both paid plans unlock the same learning tools. Only the access period changes.</p>
        </div>
        <article className="membership-plan is-featured">
          <div className="membership-plan__name">
            <span>Recommended</span>
            <h3>{halfYear.name}</h3>
            <p>{halfYear.nameZh} · {halfYear.durationZh}</p>
          </div>
          <div className="membership-plan__price">
            <strong>{formatPrice(halfYear.price)}</strong>
            <s>{formatPrice(halfYear.originalPrice)}</s>
          </div>
          <Link className="primary-button" href="/checkout?plan=half-year">Select plan <ArrowRight aria-hidden="true" /></Link>
        </article>
        <article className="membership-plan">
          <div className="membership-plan__name">
            <span>One payment</span>
            <h3>{lifetime.name}</h3>
            <p>{lifetime.nameZh} · {lifetime.durationZh}</p>
          </div>
          <div className="membership-plan__price">
            <strong>{formatPrice(lifetime.price)}</strong>
            <s>{formatPrice(lifetime.originalPrice)}</s>
          </div>
          <Link className="secondary-button" href="/checkout?plan=lifetime">Select plan <ArrowRight aria-hidden="true" /></Link>
        </article>
        <p className="membership-lifetime-note">“终身会员”指 TypeAbroad 持续提供相应会员服务期间的长期使用权益，不代表任何考试成绩承诺。</p>
      </section>

      <section className="membership-access" aria-labelledby="membership-access-title">
        <div className="membership-section-heading">
          <h2 id="membership-access-title">Start free. Upgrade when it matters.</h2>
          <p>Core practice remains available before purchase. Membership expands depth, choice and history.</p>
        </div>
        <div className="membership-comparison" role="table" aria-label="Free and member access comparison">
          <div className="membership-comparison__head" role="row">
            <span role="columnheader">Access</span><span role="columnheader">Free</span><span role="columnheader">Member</span>
          </div>
          {comparison.map(([feature, free, member]) => (
            <div className="membership-comparison__row" role="row" key={feature}>
              <strong role="cell">{feature}</strong><span role="cell">{free}</span><span role="cell"><Check aria-hidden="true" /> {member}</span>
            </div>
          ))}
        </div>
        <div className="membership-feature-notes">
          <div><h3>Free includes</h3><ul>{FREE_PLAN_FEATURES.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h3>Member includes</h3><ul>{MEMBER_PLAN_FEATURES.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="membership-process" aria-labelledby="membership-process-title">
        <div className="membership-section-heading">
          <h2 id="membership-process-title">From order to practice.</h2>
          <p>No manual screenshots. Membership will be activated from the verified payment result.</p>
        </div>
        <ol>
          <li><span>01</span><div><h3>Choose a plan</h3><p>Review the price, service period and terms before submitting an order.</p></div></li>
          <li><span>02</span><div><h3>Pay with Alipay</h3><p>The payment is completed on Alipay&apos;s secure checkout page.</p></div></li>
          <li><span>03</span><div><h3>Access is activated</h3><p>Our server confirms the payment callback and binds membership to your mobile account.</p></div></li>
        </ol>
      </section>

      <section className="membership-faq" aria-labelledby="membership-faq-title">
        <div className="membership-section-heading"><h2 id="membership-faq-title">Before you pay.</h2></div>
        <div>
          <details><summary>Will membership renew automatically?</summary><p>No. Both plans are one-time purchases and do not automatically renew.</p></details>
          <details><summary>Where is my practice data stored?</summary><p>The current version stores practice data on this device. Account-based cross-device sync is not included until that feature is explicitly released.</p></details>
          <details><summary>Does membership guarantee a higher exam score?</summary><p>No. TypeAbroad is a typing and language-familiarity tool. It does not guarantee IELTS, TOEFL or admission results.</p></details>
          <details><summary>Can I request a refund?</summary><p>Refund eligibility depends on whether digital membership has been activated and used. Read the <Link href="/refund">refund rules</Link> before purchase.</p></details>
        </div>
      </section>

      <footer className="membership-merchant">
        <ShieldCheck aria-hidden="true" />
        <div><span>Service provider</span><strong>{COMPANY_NAME}</strong></div>
        <div><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/refund">Refunds</Link></div>
      </footer>
    </div>
  );
}
