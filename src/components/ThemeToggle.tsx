"use client";

import { Moon, Sun } from "lucide-react";
import { usePreferences } from "./ThemeProvider";

export function ThemeToggle() {
  const { preferences, updatePreferences } = usePreferences();
  const isDark = preferences.theme === "dark";

  return (
    <button
      className="icon-button"
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      onClick={() => updatePreferences({ theme: isDark ? "light" : "dark" })}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
