import type { WritingWordCategory } from "./writingWords";

export type MembershipTier = "free" | "member";
export type MembershipPlanId = "half-year" | "lifetime";
export type MembershipAccessMode = "preview" | "live";

export interface MembershipPlan {
  id: MembershipPlanId;
  name: string;
  nameZh: string;
  price: number;
  originalPrice: number;
  duration: string;
  durationZh: string;
  featured: boolean;
}

export interface MembershipSnapshot {
  tier: MembershipTier;
  planId?: MembershipPlanId;
  expiresAt?: string | null;
}

export const MEMBERSHIP_PLANS: Record<MembershipPlanId, MembershipPlan> = {
  "half-year": {
    id: "half-year",
    name: "Six-month membership",
    nameZh: "半年会员",
    price: 26.6,
    originalPrice: 39,
    duration: "6 months",
    durationZh: "自开通之日起 6 个月",
    featured: true,
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime membership",
    nameZh: "终身会员",
    price: 266,
    originalPrice: 299,
    duration: "Lifetime",
    durationZh: "当前版本的长期使用权益",
    featured: false,
  },
};

export const MEMBERSHIP_ACCESS_MODE: MembershipAccessMode =
  process.env.NEXT_PUBLIC_MEMBERSHIP_ACCESS_MODE === "live" ? "live" : "preview";

export const FREE_ARTICLE_IDS = new Set([
  "ielts-tech-001",
  "ielts-edu-002",
  "ielts-task1-010",
  "toefl-discuss-001",
  "toefl-email-003",
  "academic-psych-003",
]);

export const FREE_WORD_CATEGORIES = new Set<WritingWordCategory>(["Argument", "Evidence"]);
export const FREE_WORD_SESSION_LENGTHS = new Set([10]);
export const FREE_MISTAKE_WORD_LIMIT = 10;
export const FREE_PROGRESS_RESULT_LIMIT = 7;

export const FREE_PLAN_FEATURES = [
  "6 IELTS, TOEFL and academic essay samples",
  "Argument and evidence vocabulary practice",
  "10-word practice sessions",
  "Review up to 10 saved mistake words",
  "Your latest 7 practice results",
] as const;

export const MEMBER_PLAN_FEATURES = [
  "The complete IELTS and TOEFL model essay library",
  "All 1,000+ academic words and categories",
  "10, 20 and 40-word sessions",
  "Unlimited mistake review in original context",
  "Complete progress history on this device",
] as const;

export function getMembershipPlan(value?: string | null) {
  return value === "lifetime" ? MEMBERSHIP_PLANS.lifetime : MEMBERSHIP_PLANS["half-year"];
}

export function hasMemberAccess(snapshot: MembershipSnapshot) {
  if (snapshot.tier !== "member") return false;
  if (!snapshot.expiresAt) return true;
  const expiresAt = new Date(snapshot.expiresAt).getTime();
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export function accessIsOpen(snapshot: MembershipSnapshot, mode = MEMBERSHIP_ACCESS_MODE) {
  return mode === "preview" || hasMemberAccess(snapshot);
}

export function isFreeArticle(articleId: string) {
  return FREE_ARTICLE_IDS.has(articleId);
}

export function canAccessArticle(articleId: string, snapshot: MembershipSnapshot, mode = MEMBERSHIP_ACCESS_MODE) {
  return isFreeArticle(articleId) || accessIsOpen(snapshot, mode);
}

export function canAccessWordCategory(category: string, snapshot: MembershipSnapshot, mode = MEMBERSHIP_ACCESS_MODE) {
  return FREE_WORD_CATEGORIES.has(category as WritingWordCategory) || accessIsOpen(snapshot, mode);
}

export function canAccessWordSessionLength(length: number, snapshot: MembershipSnapshot, mode = MEMBERSHIP_ACCESS_MODE) {
  return FREE_WORD_SESSION_LENGTHS.has(length) || accessIsOpen(snapshot, mode);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: price % 1 === 0 ? 0 : 1,
  }).format(price);
}
