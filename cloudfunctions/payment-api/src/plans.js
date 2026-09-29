"use strict";

const PLANS = Object.freeze({
  "half-year": Object.freeze({
    id: "half-year",
    name: "TypeAbroad six-month membership",
    amountFen: 2660,
  }),
  lifetime: Object.freeze({
    id: "lifetime",
    name: "TypeAbroad lifetime membership",
    amountFen: 26600,
  }),
});

function getPlan(planId) {
  return typeof planId === "string" ? PLANS[planId] ?? null : null;
}

function formatAmount(amountFen) {
  return (amountFen / 100).toFixed(2);
}

function parseAmountToFen(value) {
  if (typeof value !== "string" || !/^\d+(?:\.\d{1,2})?$/.test(value)) return null;
  const [yuan, decimals = ""] = value.split(".");
  const fen = Number(yuan) * 100 + Number(decimals.padEnd(2, "0"));
  return Number.isSafeInteger(fen) ? fen : null;
}

module.exports = { PLANS, formatAmount, getPlan, parseAmountToFen };
