import { Keyboard, SpellCheck2 } from "lucide-react";
import type { TypingError } from "@/lib/types";

function frequency(items: string[]) {
  const map = new Map<string, number>();
  for (const item of items) map.set(item, (map.get(item) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export function MistakeAnalysis({ errors }: { errors: TypingError[] }) {
  const wordPairs = frequency(errors.map((error) => `${error.word}|||${error.typedWord}`));
  const keys = frequency(errors.map((error) => error.expectedCharacter === " " ? "space" : error.expectedCharacter.toUpperCase()));
  const words = frequency(errors.map((error) => error.word)).filter(([word]) => word !== "space");

  return (
    <section className="result-section" id="mistake-analysis">
      <div className="result-section__heading">
        <div>
          <h2>Typing mistakes</h2>
          <p>Every wrong attempt is kept, even if you corrected it with Backspace.</p>
        </div>
      </div>

      {errors.length === 0 ? (
        <div className="perfect-run">
          <SpellCheck2 aria-hidden="true" />
          <div><strong>No mistakes in this run.</strong><span>The passage was typed exactly as written.</span></div>
        </div>
      ) : (
        <div className="mistake-layout">
          <div className="mistake-words">
            {wordPairs.slice(0, 8).map(([pair, count]) => {
              const [expected, typed] = pair.split("|||");
              return (
                <div key={pair} className="mistake-row">
                  <span>{expected}</span>
                  <span aria-hidden="true">→</span>
                  <del>{typed}</del>
                  {count > 1 && <small>×{count}</small>}
                </div>
              );
            })}
          </div>
          <div className="mistake-rankings">
            <div>
              <h3><Keyboard aria-hidden="true" /> Most mistyped keys</h3>
              {keys.slice(0, 5).map(([key, count]) => (
                <p key={key}><kbd>{key}</kbd><span>{count}</span></p>
              ))}
            </div>
            <div>
              <h3><SpellCheck2 aria-hidden="true" /> Most mistyped words</h3>
              {words.slice(0, 5).map(([word, count]) => (
                <p key={word}><span>{word}</span><span>{count}</span></p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
