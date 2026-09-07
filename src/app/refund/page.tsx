import type { Metadata } from "next";
import { COMPANY_NAME, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `Refund rules for ${SITE_NAME} digital memberships.`,
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <article className="legal-page page-shell">
      <header className="page-heading">
        <h1>Refund Policy</h1>
        <p>退款规则 · Last updated 7 September 2026</p>
      </header>
      <div className="legal-prose">
        <section>
          <h2>Before activation</h2>
          <p>如果订单已付款但会员权益因系统原因尚未开通，用户可以联系我们核实订单。确认未开通、未使用后，我们将按原支付路径处理退款。</p>
        </section>
        <section>
          <h2>After activation</h2>
          <p>
            TypeAbroad 会员属于数字化学习服务。会员权益成功开通并开始使用后，原则上不支持无理由退款；法律法规另有规定，或服务存在无法正常提供的重大问题除外。
          </p>
        </section>
        <section>
          <h2>Duplicate or incorrect payment</h2>
          <p>如发生重复扣款、金额错误或已付款但订单状态异常，请在发现后尽快联系我们，并提供订单号、付款时间和绑定手机号后四位。请勿通过普通电子邮件发送完整支付账号或验证码。</p>
        </section>
        <section>
          <h2>How refunds are returned</h2>
          <p>退款审核通过后，将尽量通过原支付渠道退回。到账时间由支付宝及付款银行的处理时间决定。</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            退款问题请发送邮件至 <a href="mailto:support@typeabroad.com">support@typeabroad.com</a>。服务提供方：{COMPANY_NAME}。
          </p>
        </section>
      </div>
    </article>
  );
}
