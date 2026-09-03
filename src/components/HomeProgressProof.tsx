"use client";

import { useEffect, useState } from "react";
import { getSessions } from "@/lib/storage";

interface HomeProgressMetric {
  value: string;
  description: string;
  basis: string;
}

const EMPTY_METRIC: HomeProgressMetric = {
  value: "—",
  description: "Complete two essays to calculate your own speed improvement.",
  basis: "Your results stay on this device.",
};

function getProgressMetric(): HomeProgressMetric {
  const sessions = getSessions();
  if (!sessions.length) return EMPTY_METRIC;

  const bestWpm = sessions.reduce((best, session) => Math.max(best, session.wpm), 0);
  if (sessions.length === 1 || !sessions.at(-1)?.wpm) {
    return {
      value: `${bestWpm} WPM`,
      description: "Your first completed essay has set a personal baseline.",
      basis: "Complete another essay to measure improvement.",
    };
  }

  const firstWpm = sessions.at(-1)!.wpm;
  const improvement = Math.round(((bestWpm - firstWpm) / firstWpm) * 100);
  return {
    value: `+${improvement}%`,
    description: "Personal-best WPM compared with your first completed essay.",
    basis: `Based on ${sessions.length} completed essays on this device.`,
  };
}

export function HomeProgressProof() {
  const [metric, setMetric] = useState<HomeProgressMetric>(EMPTY_METRIC);

  useEffect(() => {
    setMetric(getProgressMetric());
  }, []);

  return (
    <section className="home-progress-proof" aria-label="Your measured typing progress" aria-live="polite" aria-atomic="true">
      <span>Your measured result</span>
      <strong>{metric.value}</strong>
      <div>
        <p>{metric.description}</p>
        <small>{metric.basis}</small>
      </div>
    </section>
  );
}
