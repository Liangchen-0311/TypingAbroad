import { formatDuration } from "@/lib/typing";

interface TypingStatsProps {
  wpm: number;
  accuracy: number;
  elapsedSeconds: number;
  progress: number;
  showWpm: boolean;
  showAccuracy: boolean;
}

export function TypingStats({ wpm, accuracy, elapsedSeconds, progress, showWpm, showAccuracy }: TypingStatsProps) {
  return (
    <div className="typing-stats" aria-live="polite">
      {showWpm && (
        <div><span>WPM</span><strong>{wpm}</strong></div>
      )}
      {showAccuracy && (
        <div><span>ACC</span><strong>{accuracy.toFixed(0)}%</strong></div>
      )}
      <div><span>TIME</span><strong>{formatDuration(elapsedSeconds)}</strong></div>
      <div><span>PROGRESS</span><strong>{Math.round(progress)}%</strong></div>
    </div>
  );
}
