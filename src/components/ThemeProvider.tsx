"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_PREFERENCES } from "@/lib/constants";
import { getPreferences, savePreferences } from "@/lib/storage";
import type { TypingPreferences } from "@/lib/types";

interface PreferencesContextValue {
  preferences: TypingPreferences;
  updatePreferences: (updates: Partial<TypingPreferences>) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getPreferences(DEFAULT_PREFERENCES);
    setPreferences(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.style.colorScheme = preferences.theme;
    if (ready) savePreferences(preferences);
  }, [preferences, ready]);

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences: (updates: Partial<TypingPreferences>) =>
        setPreferences((current) => ({ ...current, ...updates })),
    }),
    [preferences],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences must be used inside ThemeProvider");
  return context;
}
