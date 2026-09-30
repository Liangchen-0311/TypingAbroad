import type { Metadata } from "next";
import { COMPANY_NAME, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "After-sales Policy",
  description: `After-sales and non-refundable purchase rules for ${SITE_NAME} digital memberships.`,
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <article className="legal-page page-shell">
      <header className="page-heading">
        <h1>After-sales Policy</h1>
        <p>售后规则 · Last updated 30 September 2026</p>
      </header>
      <div className="legal-prose">
        <section>
          <h2>Payment and activation</h2>
          <p>用户在付款前应确认会员方案、服务期限和金额。支付结果经服务器确认后，会员权益会立即绑定到付款时登录的 TypeAbroad 账号。</p>
        </section>
        <section>
          <h2>No change-of-mind refunds after activation</h2>
          <p>
            TypeAbroad 会员属于即时开通的数字化学习服务。付款成功并开通会员权益后，不支持因个人原因、选错方案、未充分使用或改变购买意愿提出的无理由退款。
          </p>
        </section>
        <section>
          <h2>Payment exceptions</h2>
          <p>如发生重复扣款、付款成功但会员未开通、金额与订单不一致，或平台无法正常提供已购买的核心服务，请尽快联系我们核验。法律法规另有规定的，从其规定。这些异常处理不构成面向正常已开通订单的无理由退款承诺。</p>
        </section>
        <section>
          <h2>Exception handling</h2>
          <p>异常订单经核验确需退回款项时，由工作人员通过原支付订单处理；到账时间由支付宝及付款银行决定。网站不提供用户自助退款入口。</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            支付异常请发送邮件至 <a href="mailto:support@typeabroad.com">support@typeabroad.com</a>。请提供 TypeAbroad 订单号、付款时间和绑定手机号后四位，不要发送验证码、支付密码或完整支付账号。服务提供方：{COMPANY_NAME}。
          </p>
        </section>
      </div>
    </article>
  );
}
