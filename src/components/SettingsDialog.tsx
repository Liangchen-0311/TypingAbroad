"use client";

import { useEffect, useRef } from "react";
import { Settings, X } from "lucide-react";
import { difficulties } from "@/lib/articles";
import { usePreferences } from "./ThemeProvider";

export function SettingsDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstControlRef = useRef<HTMLInputElement>(null);
  const { preferences, updatePreferences } = usePreferences();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener("click", handleClick);
    return () => dialog.removeEventListener("click", handleClick);
  }, []);

  const open = () => {
    dialogRef.current?.showModal();
    window.requestAnimationFrame(() => firstControlRef.current?.focus());
  };

  return (
    <>
      <button className="icon-button" type="button" onClick={open} aria-label="Open typing settings" title="Settings">
        <Settings aria-hidden="true" />
      </button>
      <dialog ref={dialogRef} className="settings-dialog" aria-labelledby="settings-title">
        <div className="dialog-heading">
          <div>
            <h2 id="settings-title">Typing settings</h2>
            <p>Saved automatically on this device.</p>
          </div>
          <button className="icon-button" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close settings">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="settings-grid">
          <fieldset>
            <legend>Font size</legend>
            <div className="segmented segmented--stretch">
              {(["small", "medium", "large"] as const).map((size, index) => (
                <label key={size} className={preferences.fontSize === size ? "is-active" : ""}>
                  <input
                    ref={index === 0 ? firstControlRef : undefined}
                    type="radio"
                    name="fontSize"
                    value={size}
                    checked={preferences.fontSize === size}
                    onChange={() => updatePreferences({ fontSize: size })}
                  />
                  {size[0].toUpperCase() + size.slice(1)}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Typing font</legend>
            <div className="segmented segmented--stretch">
              {(["sans", "mono"] as const).map((font) => (
                <label key={font} className={preferences.typingFont === font ? "is-active" : ""}>
                  <input
                    type="radio"
                    name="typingFont"
                    value={font}
                    checked={preferences.typingFont === font}
                    onChange={() => updatePreferences({ typingFont: font })}
                  />
                  {font === "sans" ? "Reading" : "Mono"}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Default difficulty</legend>
            <div className="segmented segmented--stretch">
              {difficulties.map((difficulty) => (
                <label key={difficulty} className={preferences.defaultDifficulty === difficulty ? "is-active" : ""}>
                  <input
                    type="radio"
                    name="difficulty"
                    value={difficulty}
                    checked={preferences.defaultDifficulty === difficulty}
                    onChange={() => updatePreferences({ defaultDifficulty: difficulty })}
                  />
                  {difficulty}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="settings-toggles">
            {[
              ["showLiveWpm", "Show live WPM"],
              ["showAccuracy", "Show accuracy"],
              ["smoothCaret", "Smooth caret"],
              ["sound", "Key sound"],
            ].map(([key, label]) => (
              <label className="switch-row" key={key}>
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={preferences[key as keyof typeof preferences] as boolean}
                  onChange={(event) => updatePreferences({ [key]: event.target.checked })}
                />
              </label>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
