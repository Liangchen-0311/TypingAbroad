"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, FileText, HardDrive, Pencil, Trash2, Undo2, Upload } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { MemberGate } from "./MemberGate";
import { useMembership } from "./MembershipProvider";
import {
  CUSTOM_PASSAGE_MAX_CHARACTERS,
  CUSTOM_PASSAGE_MAX_WORDS,
  CUSTOM_PASSAGE_MIN_WORDS,
  CUSTOM_PASSAGE_LIMIT,
  countCustomPassageWords,
  createCustomPassage,
  getCustomPassageValidationError,
  getPracticeHref,
} from "@/lib/customPassages";
import { accessIsOpen } from "@/lib/membership";
import { getCustomPassage, getCustomPassages, removeCustomPassage, saveCustomPassage } from "@/lib/storage";
import type { CustomPassage } from "@/lib/types";

function formatEditedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved on this device";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function CustomPracticeBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("passage");
  const { membership, accessMode, loading } = useMembership();
  const [passages, setPassages] = useState<CustomPassage[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [createdAt, setCreatedAt] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [recentlyDeleted, setRecentlyDeleted] = useState<CustomPassage | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const memberAccess = accessIsOpen(membership, accessMode);
  const accessLoading = loading && accessMode !== "preview";
  const wordCount = useMemo(() => countCustomPassageWords(text), [text]);
  const validationError = useMemo(() => text.trim() ? getCustomPassageValidationError(text) : null, [text]);
  const progress = Math.min(100, (wordCount / CUSTOM_PASSAGE_MIN_WORDS) * 100);

  useEffect(() => {
    const stored = getCustomPassages();
    setPassages(stored);
    if (!editingId) {
      setTitle("");
      setText("");
      setCreatedAt(undefined);
      setFormError(null);
      return;
    }
    const passage = getCustomPassage(editingId);
    if (!passage) {
      setFormError("That saved passage is no longer available on this device.");
      return;
    }
    setTitle(passage.title);
    setText(passage.text);
    setCreatedAt(passage.createdAt);
  }, [editingId]);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 200_000) {
      setFormError("This file is too large. Import a plain-text file smaller than 200 KB.");
      return;
    }
    try {
      const importedText = await file.text();
      setText(importedText);
      if (!title.trim()) setTitle(file.name.replace(/\.(txt|md|markdown)$/i, "").slice(0, 100));
      setFormError(null);
    } catch {
      setFormError("We could not read that file. Try a UTF-8 .txt or .md file.");
    }
  };

  const startPractice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = getCustomPassageValidationError(text);
    if (error) {
      setFormError(error);
      return;
    }
    if (!editingId && passages.length >= CUSTOM_PASSAGE_LIMIT) {
      setFormError(`You can keep up to ${CUSTOM_PASSAGE_LIMIT} passages on this device. Edit an existing passage to continue.`);
      return;
    }

    const passage = createCustomPassage({
      id: editingId ?? undefined,
      title,
      text,
      createdAt,
    });

    try {
      setPassages(saveCustomPassage(passage));
      router.push(getPracticeHref(passage.id));
    } catch (error) {
      setFormError(error instanceof Error && error.message === "CUSTOM_PASSAGE_LIMIT_REACHED"
        ? `You can keep up to ${CUSTOM_PASSAGE_LIMIT} passages on this device. Edit an existing passage to continue.`
        : "This browser could not save the passage. Free some storage and try again.");
    }
  };

  const loadPassage = (passage: CustomPassage) => {
    setTitle(passage.title);
    setText(passage.text);
    setCreatedAt(passage.createdAt);
    setFormError(null);
    router.replace(`/custom-practice?passage=${encodeURIComponent(passage.id)}`, { scroll: false });
    document.getElementById("custom-passage-title")?.focus({ preventScroll: true });
  };

  const deletePassage = (passage: CustomPassage) => {
    try {
      setPassages(removeCustomPassage(passage.id));
      setRecentlyDeleted(passage);
      setDeleteError(null);

      if (editingId === passage.id) {
        setTitle("");
        setText("");
        setCreatedAt(undefined);
        setFormError(null);
        router.replace("/custom-practice", { scroll: false });
      }
    } catch {
      setDeleteError("This browser could not delete the passage. Check site storage permissions and try again.");
    }
  };

  const undoDelete = () => {
    if (!recentlyDeleted) return;
    try {
      setPassages(saveCustomPassage(recentlyDeleted));
      setRecentlyDeleted(null);
      setDeleteError(null);
    } catch {
      setDeleteError("This browser could not restore the passage. Free some storage and try again.");
    }
  };

  return (
    <div className="custom-practice-page page-shell">
      <header className="custom-practice-heading">
        <div>
          <span>Member tool · Your material</span>
          <h1>Custom Practice</h1>
        </div>
        <p>Turn an essay, class reading, or application draft into the same focused typing practice as every TypeAbroad passage.</p>
      </header>

      {accessLoading ? (
        <div className="custom-practice-loading" aria-live="polite">Checking membership…</div>
      ) : !memberAccess ? (
        <>
          <section className="custom-practice-preview" aria-label="How custom practice works">
            <div><span>01</span><strong>Paste or import</strong><p>Use English text from a .txt or .md file.</p></div>
            <div><span>02</span><strong>Type normally</strong><p>The same engine tracks WPM, accuracy and progress.</p></div>
            <div><span>03</span><strong>Review mistakes</strong><p>Mistyped words return in Mistake Review with their sentence.</p></div>
          </section>
          <MemberGate title="Practise with your own passages" source="custom-practice">
            Custom Practice is a member feature. Your imported text stays on this device and becomes available as soon as membership is active.
          </MemberGate>
        </>
      ) : (
        <>
          <form className="custom-practice-workbench" onSubmit={startPractice}>
            <section className="custom-practice-editor" aria-labelledby="custom-source-title">
              <div className="custom-practice-section-heading">
                <div><span>01 · Source text</span><h2 id="custom-source-title">Bring the passage.</h2></div>
                <label className="custom-file-action" htmlFor="custom-passage-file">
                  <Upload aria-hidden="true" /> Import file
                </label>
                <input
                  className="visually-hidden"
                  id="custom-passage-file"
                  type="file"
                  accept=".txt,.md,.markdown,text/plain,text/markdown"
                  onChange={handleFile}
                />
              </div>

              <label className="custom-field" htmlFor="custom-passage-title">
                <span>Title <small>Optional</small></span>
                <input
                  id="custom-passage-title"
                  value={title}
                  maxLength={100}
                  placeholder="e.g. Technology and education"
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>

              <label className="custom-field custom-field--passage" htmlFor="custom-passage-text">
                <span>Passage <small>{wordCount.toLocaleString("en")} / {CUSTOM_PASSAGE_MAX_WORDS.toLocaleString("en")} words</small></span>
                <textarea
                  id="custom-passage-text"
                  value={text}
                  maxLength={CUSTOM_PASSAGE_MAX_CHARACTERS}
                  placeholder="Paste the English text you want to practise…"
                  aria-describedby="custom-passage-help"
                  aria-invalid={Boolean(formError)}
                  onChange={(event) => {
                    setText(event.target.value);
                    if (formError) setFormError(null);
                  }}
                />
              </label>
              <p id="custom-passage-help" className="custom-field-help">Plain text only · {CUSTOM_PASSAGE_MIN_WORDS.toLocaleString("en")}–{CUSTOM_PASSAGE_MAX_WORDS.toLocaleString("en")} words · paragraph breaks are preserved.</p>
              <p className="custom-form-error" aria-live="polite">{formError ?? "\u00a0"}</p>
            </section>

            <aside className="custom-practice-ready" aria-labelledby="custom-ready-title">
              <div>
                <span>02 · Practice setup</span>
                <h2 id="custom-ready-title">{validationError || !text.trim() ? "Add enough text to begin." : "Ready to practise."}</h2>
              </div>

              <dl>
                <div><dt>Words</dt><dd>{wordCount.toLocaleString("en")}</dd></div>
                <div><dt>Storage</dt><dd>This device</dd></div>
                <div><dt>Mistakes</dt><dd>Saved automatically</dd></div>
              </dl>

              <div className="custom-readiness" aria-label={`${Math.round(progress)} percent of minimum passage length`}>
                <span style={{ transform: `scaleX(${progress / 100})` }} />
              </div>

              <div className="custom-practice-note">
                {validationError || !text.trim() ? <FileText aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
                <p>{validationError || "Draft progress, results, and mistyped words will use the existing TypeAbroad practice flow."}</p>
              </div>

              <button className="primary-button custom-start-button" type="submit" disabled={!text.trim() || Boolean(validationError)}>
                Start practice <ArrowRight aria-hidden="true" />
              </button>
              <small><HardDrive aria-hidden="true" /> Your passage is stored in this browser, not uploaded to TypeAbroad.</small>
            </aside>
          </form>

          {(passages.length > 0 || recentlyDeleted) && (
            <section className="custom-passage-library" aria-labelledby="your-passages-title">
              <div className="custom-practice-section-heading">
                <div><span>Saved locally</span><h2 id="your-passages-title">Your passages</h2></div>
                <Link className="text-button" href="/custom-practice">New passage</Link>
              </div>
              {recentlyDeleted && (
                <div className="custom-delete-notice" role="status" aria-live="polite">
                  <div>
                    <strong>“{recentlyDeleted.title}” deleted.</strong>
                    <span>Its unfinished typing draft was removed. Completed results and mistake review remain.</span>
                  </div>
                  <button className="secondary-button" type="button" onClick={undoDelete}>
                    <Undo2 aria-hidden="true" /> Undo
                  </button>
                </div>
              )}
              {deleteError && <p className="custom-delete-error" role="alert">{deleteError}</p>}
              <div className="custom-passage-list">
                {passages.map((passage) => (
                  <article key={passage.id} className="custom-passage-row">
                    <div>
                      <span>{passage.wordCount.toLocaleString("en")} words · {formatEditedAt(passage.updatedAt)}</span>
                      <h3>{passage.title}</h3>
                    </div>
                    <div>
                      <button className="quiet-action" type="button" onClick={() => loadPassage(passage)}><Pencil aria-hidden="true" /> Edit</button>
                      <Link className="text-button" href={getPracticeHref(passage.id)}>Practice <ArrowRight aria-hidden="true" /></Link>
                      <button
                        className="quiet-action custom-delete-button"
                        type="button"
                        aria-label={`Delete ${passage.title}`}
                        onClick={() => deletePassage(passage)}
                      >
                        <Trash2 aria-hidden="true" /> Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
