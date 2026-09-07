import { describe, expect, it } from "vitest";
import {
  canAccessArticle,
  canAccessWordCategory,
  getMembershipPlan,
  hasMemberAccess,
  isFreeArticle,
} from "./membership";

describe("membership access", () => {
  it("keeps the six selected essay samples free", () => {
    expect(isFreeArticle("ielts-tech-001")).toBe(true);
    expect(isFreeArticle("toefl-email-003")).toBe(true);
    expect(isFreeArticle("ielts-work-006")).toBe(false);
  });

  it("opens all content while payment is in preview", () => {
    expect(canAccessArticle("ielts-work-006", { tier: "free" }, "preview")).toBe(true);
  });

  it("enforces member-only content in live mode", () => {
    expect(canAccessArticle("ielts-work-006", { tier: "free" }, "live")).toBe(false);
    expect(canAccessArticle("ielts-work-006", { tier: "member" }, "live")).toBe(true);
    expect(canAccessWordCategory("Change", { tier: "free" }, "live")).toBe(false);
    expect(canAccessWordCategory("Evidence", { tier: "free" }, "live")).toBe(true);
  });

  it("rejects an expired membership", () => {
    expect(hasMemberAccess({ tier: "member", expiresAt: "2020-01-01T00:00:00.000Z" })).toBe(false);
  });

  it("falls back to the recommended plan", () => {
    expect(getMembershipPlan("unknown").id).toBe("half-year");
    expect(getMembershipPlan("lifetime").price).toBe(266);
  });
});
