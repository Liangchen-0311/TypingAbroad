"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { WpmSample } from "@/lib/types";

export function TypingChart({ samples, compact = false }: { samples: WpmSample[]; compact?: boolean }) {
  const data = samples.length > 1 ? samples : [{ second: 0, wpm: 0, rawWpm: 0 }, ...samples];

  return (
    <div className={compact ? "chart chart--compact" : "chart"} aria-label="WPM over time chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
          <XAxis
            dataKey="second"
            stroke="var(--color-muted)"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}s`}
            minTickGap={30}
          />
          <YAxis stroke="var(--color-muted)" tickLine={false} axisLine={false} width={58} domain={[0, "auto"]} />
          <Line
            type="monotone"
            dataKey="rawWpm"
            stroke="var(--color-rule-strong)"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: "var(--color-accent)" }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
