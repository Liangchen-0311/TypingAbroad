"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown } from "lucide-react";

export function HomePracticePreview() {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const navigatingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const openPractice = useCallback(() => {
    if (navigatingRef.current) return;

    navigatingRef.current = true;
    setIsLeaving(true);
    document.querySelector<HTMLElement>(".home-page")?.classList.add("is-leaving");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timeoutRef.current = window.setTimeout(() => router.push("/practice"), reduceMotion ? 0 : 220);
  }, [router]);

  useEffect(() => {
    let touchStartY: number | null = null;

    const interactionIsBlocked = () => Boolean(document.querySelector("dialog[open]"));
    const editableTarget = (target: EventTarget | null) => {
      const element = target instanceof HTMLElement ? target : null;
      return Boolean(element?.closest("input, textarea, select, [contenteditable='true']"));
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY < 10 || interactionIsBlocked()) return;
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
  }, [openPractice]);

  return (
    <button
      type="button"
      className="home-scroll-cue"
      data-leaving={isLeaving ? "true" : "false"}
      disabled={isLeaving}
      aria-label="Scroll or press to open Practice"
      onClick={openPractice}
    >
      <span>Scroll to Practice</span>
      <ArrowDown aria-hidden="true" />
    </button>
  );
}
