"use strict";

function addUtcMonths(date, count) {
  const result = new Date(date);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + count);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}

function buildMembershipUpdate({ current, planId, orderId, now = new Date() }) {
  const nowIso = now.toISOString();

  if (current?.tier === "member" && current.planId === "lifetime") {
    return {
      ...current,
      tier: "member",
      planId: "lifetime",
      expiresAt: null,
      updatedAt: nowIso,
      sourceOrderId: current.sourceOrderId ?? orderId,
    };
  }

  if (planId === "lifetime") {
    return {
      tier: "member",
      planId: "lifetime",
      expiresAt: null,
      activatedAt: current?.activatedAt ?? nowIso,
      updatedAt: nowIso,
      sourceOrderId: orderId,
    };
  }

  const existingExpiry = current?.expiresAt ? new Date(current.expiresAt) : null;
  const activeExpiry = existingExpiry && Number.isFinite(existingExpiry.getTime()) && existingExpiry > now
    ? existingExpiry
    : now;

  return {
    tier: "member",
    planId: "half-year",
    expiresAt: addUtcMonths(activeExpiry, 6).toISOString(),
    activatedAt: current?.activatedAt ?? nowIso,
    updatedAt: nowIso,
    sourceOrderId: orderId,
  };
}

function toMembershipSnapshot(record, now = new Date()) {
  if (!record || record.tier !== "member") return { tier: "free" };
  if (record.planId === "lifetime") {
    return { tier: "member", planId: "lifetime", expiresAt: null };
  }
  const expiresAt = typeof record.expiresAt === "string" ? new Date(record.expiresAt) : null;
  if (!expiresAt || !Number.isFinite(expiresAt.getTime()) || expiresAt <= now) return { tier: "free" };
  return { tier: "member", planId: "half-year", expiresAt: expiresAt.toISOString() };
}

module.exports = { addUtcMonths, buildMembershipUpdate, toMembershipSnapshot };
