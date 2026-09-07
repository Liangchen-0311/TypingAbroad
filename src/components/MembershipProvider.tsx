"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  MEMBERSHIP_ACCESS_MODE,
  type MembershipAccessMode,
  type MembershipSnapshot,
} from "@/lib/membership";

interface MembershipContextValue {
  membership: MembershipSnapshot;
  accessMode: MembershipAccessMode;
  loading: boolean;
  refreshMembership: () => Promise<void>;
}

const FREE_MEMBERSHIP: MembershipSnapshot = { tier: "free" };

const MembershipContext = createContext<MembershipContextValue>({
  membership: FREE_MEMBERSHIP,
  accessMode: MEMBERSHIP_ACCESS_MODE,
  loading: false,
  refreshMembership: async () => undefined,
});

function isMembershipSnapshot(value: unknown): value is MembershipSnapshot {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MembershipSnapshot>;
  return candidate.tier === "free" || candidate.tier === "member";
}

export function MembershipProvider({ children }: { children: React.ReactNode }) {
  const [membership, setMembership] = useState<MembershipSnapshot>(FREE_MEMBERSHIP);
  const [loading, setLoading] = useState(Boolean(process.env.NEXT_PUBLIC_ACCOUNT_API_BASE));

  const refreshMembership = useCallback(async () => {
    const apiBase = process.env.NEXT_PUBLIC_ACCOUNT_API_BASE?.replace(/\/$/, "");
    if (!apiBase) {
      setMembership(FREE_MEMBERSHIP);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/v1/me/membership`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Membership request failed");
      const payload: unknown = await response.json();
      setMembership(isMembershipSnapshot(payload) ? payload : FREE_MEMBERSHIP);
    } catch {
      setMembership(FREE_MEMBERSHIP);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshMembership();
  }, [refreshMembership]);

  const value = useMemo(() => ({
    membership,
    accessMode: MEMBERSHIP_ACCESS_MODE,
    loading,
    refreshMembership,
  }), [loading, membership, refreshMembership]);

  return <MembershipContext.Provider value={value}>{children}</MembershipContext.Provider>;
}

export function useMembership() {
  return useContext(MembershipContext);
}
