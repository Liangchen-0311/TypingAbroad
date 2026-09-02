"use client";

import type { ArticleLength, Difficulty, Exam } from "@/lib/types";
import { difficulties, lengths } from "@/lib/articles";

const taskTypes: Record<Exam, string[]> = {
  IELTS: ["Writing Task 1", "Writing Task 2"],
  TOEFL: ["Write an Email", "Academic Discussion"],
  "Academic English": ["Technology", "Education", "Environment", "Economics", "Science", "Society", "Psychology"],
};

interface ArticleSelectorProps {
  exam: Exam;
  taskType: string;
  difficulty: Difficulty;
  length: ArticleLength;
  onExam: (exam: Exam) => void;
  onTaskType: (taskType: string) => void;
  onDifficulty: (difficulty: Difficulty) => void;
  onLength: (length: ArticleLength) => void;
}

function SelectorRow<T extends string>({ label, values, value, onChange }: { label: string; values: readonly T[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className="selector-row">
      <span>{label}</span>
      <div role="group" aria-label={label}>
        {values.map((item) => (
          <button key={item} type="button" className={item === value ? "is-active" : ""} aria-pressed={item === value} onClick={() => onChange(item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ArticleSelector(props: ArticleSelectorProps) {
  return (
    <section className="article-selector" aria-label="Article filters">
      <SelectorRow label="Exam" values={["IELTS", "TOEFL", "Academic English"] as Exam[]} value={props.exam} onChange={props.onExam} />
      <SelectorRow label="Type" values={taskTypes[props.exam]} value={props.taskType} onChange={props.onTaskType} />
      <div className="selector-split">
        <SelectorRow label="Difficulty" values={difficulties} value={props.difficulty} onChange={props.onDifficulty} />
        <SelectorRow label="Length" values={lengths} value={props.length} onChange={props.onLength} />
      </div>
    </section>
  );
}
