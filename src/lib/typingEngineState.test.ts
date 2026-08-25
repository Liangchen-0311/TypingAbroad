import { describe, expect, it } from "vitest";
import { getEngineElapsedMs, initialEngineState, typingEngineReducer } from "./typingEngineState";

function typeText(target: string) {
  return Array.from(target).reduce(
    (state, character, index) => typingEngineReducer(state, { type: "CHARACTER", character, target, timestamp: index + 1 }),
    initialEngineState,
  );
}

describe("typing engine state", () => {
  it("keeps every character during a long continuous input burst", () => {
    const target = "Fast input, spaces, punctuation, and 2026 numbers. ".repeat(12);
    const state = typeText(target);
    expect(state.typed.join("")).toBe(target);
    expect(state.inputCount).toBe(target.length);
    expect(state.errors).toHaveLength(0);
    expect(state.isFinished).toBe(true);
  });

  it("keeps historical errors after Backspace correction", () => {
    const target = "cat";
    let state = typingEngineReducer(initialEngineState, { type: "CHARACTER", character: "c", target, timestamp: 1 });
    state = typingEngineReducer(state, { type: "CHARACTER", character: "x", target, timestamp: 2 });
    state = typingEngineReducer(state, { type: "BACKSPACE" });
    state = typingEngineReducer(state, { type: "CHARACTER", character: "a", target, timestamp: 3 });
    state = typingEngineReducer(state, { type: "CHARACTER", character: "t", target, timestamp: 4 });
    expect(state.typed.join("")).toBe(target);
    expect(state.errors).toHaveLength(1);
    expect(state.errors[0].typedCharacter).toBe("x");
    expect(state.isFinished).toBe(true);
  });

  it("ignores input while paused and resumes without losing the index", () => {
    const target = "go";
    let state = typingEngineReducer(initialEngineState, { type: "CHARACTER", character: "g", target, timestamp: 1 });
    state = typingEngineReducer(state, { type: "PAUSE", timestamp: 2 });
    state = typingEngineReducer(state, { type: "CHARACTER", character: "x", target, timestamp: 3 });
    expect(state.typed.join("")).toBe("g");
    state = typingEngineReducer(state, { type: "RESUME", timestamp: 12 });
    state = typingEngineReducer(state, { type: "CHARACTER", character: "o", target, timestamp: 13 });
    expect(state.pausedMs).toBe(10);
    expect(state.isFinished).toBe(true);
  });

  it("restores a draft without counting time spent away", () => {
    const target = "study";
    const state = typingEngineReducer(initialEngineState, {
      type: "RESTORE",
      draft: {
        version: 1,
        articleId: "article-1",
        targetLength: target.length,
        typed: ["s", "t"],
        errors: [],
        inputCount: 2,
        correctInputCount: 2,
        elapsedMs: 4_000,
        samples: [],
        savedMistakeWords: [],
        savedAt: new Date(0).toISOString(),
      },
    });

    expect(state.typed.join("")).toBe("st");
    expect(getEngineElapsedMs(state, 50_000)).toBe(4_000);

    const resumed = typingEngineReducer(state, { type: "CHARACTER", character: "u", target, timestamp: 50_000 });
    expect(getEngineElapsedMs(resumed, 51_000)).toBe(5_000);
  });
});
