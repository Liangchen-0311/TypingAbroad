import { createTypingError } from "./typing";
import type { TypingDraft, TypingError } from "./types";

export interface EngineState {
  typed: string[];
  errors: TypingError[];
  inputCount: number;
  correctInputCount: number;
  startTime: number | null;
  endTime: number | null;
  pausedAt: number | null;
  pausedMs: number;
  carriedElapsedMs: number;
  isFinished: boolean;
}

export type EngineAction =
  | { type: "CHARACTER"; character: string; timestamp: number; target: string }
  | { type: "BACKSPACE" }
  | { type: "PAUSE"; timestamp: number }
  | { type: "RESUME"; timestamp: number }
  | { type: "RESTORE"; draft: TypingDraft }
  | { type: "RESTART" };

export const initialEngineState: EngineState = {
  typed: [],
  errors: [],
  inputCount: 0,
  correctInputCount: 0,
  startTime: null,
  endTime: null,
  pausedAt: null,
  pausedMs: 0,
  carriedElapsedMs: 0,
  isFinished: false,
};

export function getEngineElapsedMs(state: EngineState, now: number) {
  if (state.startTime === null) return state.carriedElapsedMs;
  const endpoint = state.endTime ?? state.pausedAt ?? now;
  return state.carriedElapsedMs + Math.max(0, endpoint - state.startTime - state.pausedMs);
}

export function typingEngineReducer(state: EngineState, action: EngineAction): EngineState {
  switch (action.type) {
    case "CHARACTER": {
      if (state.isFinished || state.pausedAt !== null || state.typed.length >= action.target.length) return state;
      const position = state.typed.length;
      const expected = action.target[position];
      const correct = action.character === expected;
      const typed = [...state.typed, action.character];
      const isFinished = typed.length === action.target.length;
      return {
        ...state,
        typed,
        errors: correct
          ? state.errors
          : [...state.errors, createTypingError(action.target, position, action.character, action.timestamp)],
        inputCount: state.inputCount + 1,
        correctInputCount: state.correctInputCount + (correct ? 1 : 0),
        startTime: state.startTime ?? action.timestamp,
        endTime: isFinished ? action.timestamp : null,
        isFinished,
      };
    }
    case "BACKSPACE":
      if (state.isFinished || state.pausedAt !== null || state.typed.length === 0) return state;
      return { ...state, typed: state.typed.slice(0, -1) };
    case "PAUSE":
      if (state.isFinished || state.startTime === null || state.pausedAt !== null) return state;
      return { ...state, pausedAt: action.timestamp };
    case "RESUME":
      if (state.pausedAt === null) return state;
      return { ...state, pausedMs: state.pausedMs + action.timestamp - state.pausedAt, pausedAt: null };
    case "RESTORE":
      return {
        typed: action.draft.typed,
        errors: action.draft.errors,
        inputCount: action.draft.inputCount,
        correctInputCount: action.draft.correctInputCount,
        startTime: null,
        endTime: null,
        pausedAt: null,
        pausedMs: 0,
        carriedElapsedMs: action.draft.elapsedMs,
        isFinished: false,
      };
    case "RESTART":
      return initialEngineState;
  }
}
