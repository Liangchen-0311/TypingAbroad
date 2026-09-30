"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleUserRound } from "lucide-react";
import { useAccount } from "./AccountProvider";
import { useMembership } from "./MembershipProvider";
import { getMembershipPlan, hasMemberAccess } from "@/lib/membership";

function formatExpiry(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function MembershipStatusCard() {
  const { user, loading: accountLoading, openAccount } = useAccount();
  const { membership, loading: membershipLoading } = useMembership();
  const loading = accountLoading || membershipLoading;
  const memberActive = hasMemberAccess(membership);
  const plan = memberActive && membership.planId ? getMembershipPlan(membership.planId) : null;
  const expiry = formatExpiry(membership.expiresAt);

  return (
    <aside className={`membership-status-card${memberActive ? " is-member" : ""}`} aria-live="polite">
      {memberActive ? <CheckCircle2 aria-hidden="true" /> : <CircleUserRound aria-hidden="true" />}
      <div>
        <span>Current access</span>
        <strong>{loading ? "Checking your access…" : memberActive ? "Member access is active" : "Free access"}</strong>
        {!loading && (
          <p>
            {memberActive
              ? membership.planId === "lifetime"
                ? `${plan?.nameZh ?? "终身会员"} · 长期使用权益已绑定到当前账号。`
                : `${plan?.nameZh ?? "半年会员"}${expiry ? ` · 有效期至 ${expiry}` : ""}。`
              : user
                ? "当前账号尚未开通会员；付款确认后，此处会立即显示会员状态。"
                : "登录后可查看会员状态；未开通时仍可使用下方列出的免费内容。"}
          </p>
        )}
      </div>
      {!loading && (memberActive ? (
        <Link className="text-button" href="/library">Open full library <ArrowRight aria-hidden="true" /></Link>
      ) : user ? (
        <Link className="text-button" href="/checkout?plan=half-year">Choose a plan <ArrowRight aria-hidden="true" /></Link>
      ) : (
        <button className="text-button" type="button" onClick={openAccount}>Sign in to check</button>
      ))}
    </aside>
  );
}
