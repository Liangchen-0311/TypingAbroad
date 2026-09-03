export type Exam = "IELTS" | "TOEFL" | "Academic English";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type ArticleLength = "Short" | "Medium" | "Long";

export interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
}

export interface SentenceStructure {
  pattern: string;
  explanation: string;
  template: string;
}

export interface Article {
  id: string;
  title: string;
  exam: Exam;
  taskType: string;
  topic: string;
  difficulty: Difficulty;
  length: ArticleLength;
  wordCount: number;
  estimatedBand?: string;
  text: string;
  vocabulary: VocabularyItem[];
  collocations: string[];
  sentenceStructures: SentenceStructure[];
  tags: string[];
}

export interface TypingError {
  expectedCharacter: string;
  typedCharacter: string;
  position: number;
  word: string;
  typedWord: string;
  timestamp: number;
}

export interface WpmSample {
  second: number;
  wpm: number;
  rawWpm: number;
}

export interface TypingDraft {
  version: 1;
  articleId: string;
  targetLength: number;
  typed: string[];
  errors: TypingError[];
  inputCount: number;
  correctInputCount: number;
  elapsedMs: number;
  samples: WpmSample[];
  savedMistakeWords: string[];
  savedAt: string;
}

export type WordPracticeSource = "common" | "mistakes";
export type WordPracticeStage = "word" | "context";
export type WordPracticeCycleProgress = Record<string, string[]>;

export interface WordPracticeDraft {
  version: 1;
  source: WordPracticeSource;
  category: string;
  sessionLength: number;
  shuffleVersion: number;
  sessionWordIds: string[];
  index: number;
  stage?: WordPracticeStage;
  firstPassCorrect?: boolean;
  currentPassHadError?: boolean;
  typed: string[];
  errorCount: number;
  masteredCount: number;
  skippedCount: number;
  inputCount?: number;
  elapsedMs?: number;
  savedMistakeKeys: string[];
  savedAt: string;
}

export interface WordPracticeResult {
  version: 1;
  id: string;
  source: WordPracticeSource;
  category: string;
  requestedLength: number;
  totalWords: number;
  completedWords: number;
  skippedWords: number;
  errorCount: number;
  inputCount: number;
  accuracy: number;
  duration: number;
  wordIds: string[];
  createdAt: string;
}

export interface TypingResult {
  id: string;
  articleId: string;
  articleTitle: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: number;
  errors: TypingError[];
  errorCount: number;
  characters: number;
  consistency: number;
  samples: WpmSample[];
  createdAt: string;
}

export interface TypingPreferences {
  version: 2;
  theme: "light" | "dark";
  fontSize: "small" | "medium" | "large";
  typingFont: "sans" | "mono";
  showLiveWpm: boolean;
  showAccuracy: boolean;
  smoothCaret: boolean;
  sound: boolean;
  defaultDifficulty: Difficulty;
}

export interface SavedVocabulary extends VocabularyItem {
  id: string;
  sourceArticleId: string;
  sourceTitle: string;
  sourceHref?: string;
  meaningZh?: string;
  mistakeContext?: string;
  savedFromMistake?: boolean;
  mistakeCount?: number;
  learned: boolean;
  savedAt: string;
}
