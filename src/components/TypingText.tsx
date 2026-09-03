"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

interface TypingTextProps {
  targetText: string;
  typedCharacters: string[];
  smoothCaret: boolean;
  revealTarget?: boolean;
  deferValidation?: boolean;
  ariaLabel?: string;
}

export function TypingText({
  targetText,
  typedCharacters,
  smoothCaret,
  revealTarget = true,
  deferValidation = false,
  ariaLabel,
}: TypingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const [caretReady, setCaretReady] = useState(false);
  const wordSegments = useMemo(() => {
    const segments = targetText.match(/\S+\s*|\s+/g) ?? [targetText];
    return segments.reduce<Array<{ start: number; text: string }>>((result, text) => {
      const previous = result.at(-1);
      const start = previous ? previous.start + Array.from(previous.text).length : 0;
      return [...result, { start, text }];
    }, []);
  }, [targetText]);
  const targetCharacters = useMemo(() => Array.from(targetText), [targetText]);
  const validationReady = !deferValidation || typedCharacters.length >= targetCharacters.length;

  const positionCaret = useCallback(() => {
    const container = containerRef.current;
    const current = currentRef.current;
    const caret = caretRef.current;
    if (!container || !current || !caret) return;

    const containerRect = container.getBoundingClientRect();
    const currentRect = current.getBoundingClientRect();
    const x = currentRect.left - containerRect.left + container.scrollLeft;
    const y = currentRect.top - containerRect.top + container.scrollTop + (currentRect.height * 0.5);

    caret.style.setProperty("--caret-x", `${x}px`);
    caret.style.setProperty("--caret-y", `${y}px`);
    if (!caretReady) setCaretReady(true);
  }, [caretReady]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const current = currentRef.current;
    if (!container || !current) return;

    positionCaret();
    const containerRect = container.getBoundingClientRect();
    const currentRect = current.getBoundingClientRect();
    const caretTop = currentRect.top - containerRect.top + container.scrollTop;
    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;
    const comfort = container.clientHeight * 0.25;
    if (caretTop < visibleTop + comfort || caretTop > visibleBottom - comfort) {
      container.scrollTo({
        top: Math.max(0, caretTop - container.clientHeight / 2),
        behavior: smoothCaret ? "smooth" : "auto",
      });
    }
  }, [positionCaret, smoothCaret, targetText, typedCharacters.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(positionCaret);
    observer.observe(container);
    void document.fonts?.ready.then(positionCaret);
    return () => observer.disconnect();
  }, [positionCaret]);

  return (
    <div ref={containerRef} className="typing-text" aria-label={ariaLabel ?? `Text to type: ${targetText}`}>
      <span className="typing-words" aria-hidden="true">
        {revealTarget ? (
          <>
            {wordSegments.map((segment) => {
              return (
                <span className="typing-word" key={`${segment.start}-${segment.text}`}>
                  {Array.from(segment.text).map((character, localIndex) => {
                    const index = segment.start + localIndex;
                    const typed = typedCharacters[index];
                    const status = typed === undefined ? "pending" : typed === character ? "correct" : "incorrect";
                    const isCurrent = index === typedCharacters.length;
                    return (
                      <span
                        key={`${index}-${character}`}
                        ref={isCurrent ? currentRef : undefined}
                        className={`typing-character is-${status}${isCurrent ? " is-current" : ""}`}
                        data-typed={typed === " " && typed !== character ? "·" : typed}
                      >
                        {character}
                      </span>
                    );
                  })}
                </span>
              );
            })}
            {typedCharacters.length === targetText.length && (
              <span ref={currentRef} className="typing-character typing-end is-current" />
            )}
          </>
        ) : (
          <span className="typing-word">
            {targetCharacters.map((targetCharacter, index) => {
              const character = typedCharacters[index];
              const status = character === undefined
                ? "placeholder"
                : !validationReady
                  ? "entered"
                  : character === targetCharacter
                    ? "correct"
                    : "incorrect";
              const isCurrent = index === typedCharacters.length;
              return (
                <span
                  key={`${index}-slot`}
                  ref={isCurrent ? currentRef : undefined}
                  className={`typing-character is-${status}${isCurrent ? " is-current" : ""}`}
                >
                  {character ?? "_"}
                </span>
              );
            })}
            {typedCharacters.length === targetCharacters.length && (
              <span ref={currentRef} className="typing-character typing-end is-current" />
            )}
          </span>
        )}
      </span>
      <span
        ref={caretRef}
        className={`typing-caret${caretReady ? " is-ready" : ""}${smoothCaret ? " is-smooth" : ""}`}
        aria-hidden="true"
      />
    </div>
  );
}
