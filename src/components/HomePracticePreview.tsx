"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown } from "lucide-react";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => {
    finished: Promise<void>;
  };
};

export function HomePracticePreview() {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const navigatingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const navigateToPractice = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (document.querySelector(".practice-page")) {
        resolve();
        return;
      }

      let settled = false;
      const observer = new MutationObserver(() => {
        if (document.querySelector(".practice-page")) finish();
      });
      const fallbackTimer = window.setTimeout(() => finish(), 1200);

      const finish = () => {
        if (settled) return;
        settled = true;
        observer.disconnect();
        window.clearTimeout(fallbackTimer);
        resolve();
      };

      observer.observe(document.body, { childList: true, subtree: true });
      router.push("/practice");
    });
  }, [router]);

  const openPractice = useCallback(() => {
    if (navigatingRef.current) return;

    navigatingRef.current = true;
    setIsLeaving(true);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      router.push("/practice");
      return;
    }

    const transitionDocument = document as ViewTransitionDocument;
    if (transitionDocument.startViewTransition) {
      const startViewTransition = transitionDocument.startViewTransition.bind(transitionDocument);
      timeoutRef.current = window.setTimeout(() => {
        try {
          const transition = startViewTransition(navigateToPractice);
          transition.finished.catch(() => undefined);
        } catch {
          router.push("/practice");
        }
      }, 120);
      return;
    }

    document.querySelector<HTMLElement>(".home-page")?.classList.add("is-leaving");
    timeoutRef.current = window.setTimeout(() => router.push("/practice"), 220);
  }, [navigateToPractice, router]);

  useEffect(() => {
    router.prefetch("/practice");

    let touchStartY: number | null = null;

    const interactionIsBlocked = () => Boolean(document.querySelector("dialog[open]"));
    const editableTarget = (target: EventTarget | null) => {
      const element = target instanceof HTMLElement ? target : null;
      return Boolean(element?.closest("input, textarea, select, [contenteditable='true']"));
    };

    const handleWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey
        || event.deltaY < 10
        || Math.abs(event.deltaY) <= Math.abs(event.deltaX)
        || interactionIsBlocked()
      ) return;
      event.preventDefault();
      openPractice();
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      if (touchStartY === null || currentY === undefined || interactionIsBlocked()) return;
      if (touchStartY - currentY < 36) return;

      event.preventDefault();
      touchStartY = null;
      openPractice();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (editableTarget(event.target) || interactionIsBlocked()) return;
      if (event.key !== "ArrowDown" && event.key !== "PageDown") return;

      event.preventDefault();
      openPractice();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, [openPractice, router]);

  return (
    <button
      type="button"
      className="home-scroll-cue"
      data-leaving={isLeaving ? "true" : "false"}
      disabled={isLeaving}
      aria-label="Scroll or press to open Practice"
      onClick={openPractice}
    >
      <span className="home-scroll-cue__label">
        <ArrowDown className="home-scroll-cue__icon" aria-hidden="true" />
        <span>Scroll to Practice</span>
      </span>
    </button>
  );
}
