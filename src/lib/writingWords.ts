import { ACADEMIC_WORD_DATA } from "./academicWordData";

export const WRITING_WORD_CATEGORIES = ["Argument", "Evidence", "Cause & effect", "Change", "Evaluation", "General academic"] as const;

export type WritingWordCategory = (typeof WRITING_WORD_CATEGORIES)[number];

export interface WritingWord {
  id: string;
  word: string;
  meaningZh: string;
  definition: string;
  example: string;
  category: WritingWordCategory;
}

const CURATED_WRITING_WORDS: WritingWord[] = [
  {
    id: "acknowledge",
    word: "acknowledge",
    meaningZh: "承认；认可",
    definition: "to accept that something is true or important",
    example: "Governments should acknowledge the long-term cost of inaction.",
    category: "Argument",
  },
  {
    id: "advocate",
    word: "advocate",
    meaningZh: "提倡；主张",
    definition: "to publicly support a policy or idea",
    example: "Many educators advocate a more flexible assessment system.",
    category: "Argument",
  },
  {
    id: "assert",
    word: "assert",
    meaningZh: "断言；坚称",
    definition: "to state an opinion confidently",
    example: "Critics assert that the policy places an unfair burden on families.",
    category: "Argument",
  },
  {
    id: "contend",
    word: "contend",
    meaningZh: "主张；认为",
    definition: "to argue that a claim is true",
    example: "Some researchers contend that early intervention is more effective.",
    category: "Argument",
  },
  {
    id: "justify",
    word: "justify",
    meaningZh: "证明……合理",
    definition: "to give a convincing reason for something",
    example: "Short-term savings do not justify permanent environmental damage.",
    category: "Argument",
  },
  {
    id: "perspective",
    word: "perspective",
    meaningZh: "观点；视角",
    definition: "a particular way of considering an issue",
    example: "The debate looks different from a rural perspective.",
    category: "Argument",
  },
  {
    id: "premise",
    word: "premise",
    meaningZh: "前提；假设",
    definition: "an idea on which an argument is based",
    example: "This proposal rests on the premise that demand will remain stable.",
    category: "Argument",
  },
  {
    id: "refute",
    word: "refute",
    meaningZh: "反驳；驳斥",
    definition: "to prove that a statement is incorrect",
    example: "Recent evidence helps refute the claim that remote work reduces output.",
    category: "Argument",
  },
  {
    id: "analyse",
    word: "analyse",
    meaningZh: "分析",
    definition: "to examine something carefully and methodically",
    example: "The report analyses how income influences access to education.",
    category: "Evidence",
  },
  {
    id: "demonstrate",
    word: "demonstrate",
    meaningZh: "证明；说明",
    definition: "to show something clearly with evidence",
    example: "The figures demonstrate a steady rise in public transport use.",
    category: "Evidence",
  },
  {
    id: "indicate",
    word: "indicate",
    meaningZh: "表明；显示",
    definition: "to point to a fact or possible conclusion",
    example: "Survey results indicate that cost remains the main concern.",
    category: "Evidence",
  },
  {
    id: "infer",
    word: "infer",
    meaningZh: "推断；推论",
    definition: "to reach a conclusion from available evidence",
    example: "We cannot infer causation from a single correlation.",
    category: "Evidence",
  },
  {
    id: "interpret",
    word: "interpret",
    meaningZh: "解释；理解",
    definition: "to explain the meaning of information",
    example: "Readers may interpret the same statistic in different ways.",
    category: "Evidence",
  },
  {
    id: "relevant",
    word: "relevant",
    meaningZh: "相关的；切题的",
    definition: "closely connected to the subject being discussed",
    example: "Only relevant evidence should be included in the final paragraph.",
    category: "Evidence",
  },
  {
    id: "significant",
    word: "significant",
    meaningZh: "重要的；显著的",
    definition: "large or important enough to be noticed",
    example: "There was a significant difference between the two age groups.",
    category: "Evidence",
  },
  {
    id: "valid",
    word: "valid",
    meaningZh: "有效的；合理的",
    definition: "well founded and logically acceptable",
    example: "Cost is a valid concern, but it is not the only consideration.",
    category: "Evidence",
  },
  {
    id: "contribute",
    word: "contribute",
    meaningZh: "促成；导致",
    definition: "to help cause a result",
    example: "Reliable childcare can contribute to higher employment rates.",
    category: "Cause & effect",
  },
  {
    id: "consequence",
    word: "consequence",
    meaningZh: "后果；结果",
    definition: "a result produced by an action or condition",
    example: "One unintended consequence was greater pressure on local services.",
    category: "Cause & effect",
  },
  {
    id: "derive",
    word: "derive",
    meaningZh: "源于；获得",
    definition: "to obtain something from a source",
    example: "Many communities derive income from sustainable tourism.",
    category: "Cause & effect",
  },
  {
    id: "facilitate",
    word: "facilitate",
    meaningZh: "促进；使便利",
    definition: "to make a process easier or more likely",
    example: "Digital records facilitate cooperation between hospitals.",
    category: "Cause & effect",
  },
  {
    id: "factor",
    word: "factor",
    meaningZh: "因素；要素",
    definition: "a circumstance that influences a result",
    example: "Housing cost is a major factor in migration decisions.",
    category: "Cause & effect",
  },
  {
    id: "impact",
    word: "impact",
    meaningZh: "影响；作用",
    definition: "a strong effect on a situation or person",
    example: "The reform had a measurable impact on class attendance.",
    category: "Cause & effect",
  },
  {
    id: "inhibit",
    word: "inhibit",
    meaningZh: "抑制；阻碍",
    definition: "to prevent or slow down an activity",
    example: "Excessive regulation may inhibit small-business growth.",
    category: "Cause & effect",
  },
  {
    id: "trigger",
    word: "trigger",
    meaningZh: "引发；触发",
    definition: "to cause an event or process to begin",
    example: "A sharp price increase can trigger changes in consumer behaviour.",
    category: "Cause & effect",
  },
  {
    id: "adapt",
    word: "adapt",
    meaningZh: "适应；调整",
    definition: "to change in response to new conditions",
    example: "Cities must adapt their infrastructure to a warmer climate.",
    category: "Change",
  },
  {
    id: "decline",
    word: "decline",
    meaningZh: "下降；减少",
    definition: "to become smaller, weaker, or less common",
    example: "Private car use began to decline after the rail network expanded.",
    category: "Change",
  },
  {
    id: "emerge",
    word: "emerge",
    meaningZh: "出现；显现",
    definition: "to become known or visible",
    example: "New forms of employment continue to emerge online.",
    category: "Change",
  },
  {
    id: "expand",
    word: "expand",
    meaningZh: "扩大；扩展",
    definition: "to increase in size, scope, or importance",
    example: "The university plans to expand access to evening courses.",
    category: "Change",
  },
  {
    id: "fluctuate",
    word: "fluctuate",
    meaningZh: "波动；起伏",
    definition: "to rise and fall irregularly",
    example: "Energy prices tend to fluctuate throughout the year.",
    category: "Change",
  },
  {
    id: "maintain",
    word: "maintain",
    meaningZh: "维持；保持",
    definition: "to keep something at the same level or condition",
    example: "Schools need stable funding to maintain teaching quality.",
    category: "Change",
  },
  {
    id: "modify",
    word: "modify",
    meaningZh: "修改；调整",
    definition: "to make a partial change to something",
    example: "The scheme was modified after feedback from residents.",
    category: "Change",
  },
  {
    id: "transform",
    word: "transform",
    meaningZh: "转变；改造",
    definition: "to change something greatly in form or character",
    example: "Affordable internet access can transform rural education.",
    category: "Change",
  },
  {
    id: "beneficial",
    word: "beneficial",
    meaningZh: "有益的；有利的",
    definition: "producing a helpful or positive effect",
    example: "Regular feedback is beneficial to independent learners.",
    category: "Evaluation",
  },
  {
    id: "considerable",
    word: "considerable",
    meaningZh: "相当大的；可观的",
    definition: "notably large in amount or degree",
    example: "The transition requires considerable public investment.",
    category: "Evaluation",
  },
  {
    id: "efficient",
    word: "efficient",
    meaningZh: "高效的；有效率的",
    definition: "working well without wasting time or resources",
    example: "A compact rail system is more efficient than repeated road expansion.",
    category: "Evaluation",
  },
  {
    id: "feasible",
    word: "feasible",
    meaningZh: "可行的；行得通的",
    definition: "possible and practical to achieve",
    example: "The target is ambitious but feasible with consistent funding.",
    category: "Evaluation",
  },
  {
    id: "inevitable",
    word: "inevitable",
    meaningZh: "不可避免的",
    definition: "certain to happen and impossible to avoid",
    example: "Some disruption is inevitable during major construction work.",
    category: "Evaluation",
  },
  {
    id: "substantial",
    word: "substantial",
    meaningZh: "大量的；重大的",
    definition: "large in size, value, or importance",
    example: "The programme produced substantial gains in literacy.",
    category: "Evaluation",
  },
  {
    id: "sustainable",
    word: "sustainable",
    meaningZh: "可持续的",
    definition: "able to continue without exhausting resources",
    example: "Long-term planning is essential for sustainable urban growth.",
    category: "Evaluation",
  },
  {
    id: "widespread",
    word: "widespread",
    meaningZh: "广泛的；普遍的",
    definition: "existing or happening across a large area or group",
    example: "The change received widespread support from younger voters.",
    category: "Evaluation",
  },
];

const curatedIds = new Set(CURATED_WRITING_WORDS.map((item) => item.id));

const ACADEMIC_CATEGORY_WORDS: ReadonlyArray<readonly [WritingWordCategory, readonly string[]]> = [
  ["Argument", [
    "claim", "opinion", "assume", "challenge", "propose", "deny", "declare", "notion",
    "comment", "appeal", "oppose", "assumption", "dispute", "opponent", "controversy", "objection",
    "recommendation", "convince", "consensus", "rational", "logic", "ideology", "bias", "intent",
    "dilemma", "deem", "contemplate", "concede", "endorse", "protest", "accuse", "complaint",
  ]],
  ["Evidence", [
    "evidence", "figure", "analysis", "identify", "compare", "survey", "sample", "assessment",
    "confirm", "investigation", "observe", "investigate", "estimate", "observation", "illustrate", "statistics",
    "cite", "perceive", "detect", "inspection", "trace", "questionnaire", "accuracy", "audit",
    "classify", "distinguish", "chart", "publication", "witness", "monitor", "revelation", "hypothesis",
  ]],
  ["Cause & effect", [
    "effect", "cause", "affect", "pressure", "occur", "involve", "role", "process",
    "condition", "promote", "generate", "arise", "outcome", "mechanism", "stimulus", "induce",
    "motivate", "stem", "yield", "boost", "enhance", "reinforce", "eliminate", "undermine",
    "provoke", "dissolve", "collapse", "expansion", "conversion", "recover", "tendency", "dependent",
  ]],
  ["Change", [
    "current", "previous", "eventually", "reform", "release", "extend", "adopt", "initial",
    "acquire", "trend", "vary", "transfer", "shift", "variation", "proceed", "sequence",
    "slide", "swing", "alter", "adjust", "transition", "convert", "evolution", "restore",
    "switch", "withdraw", "fade", "resume", "decrease", "diminish", "cease", "phase",
  ]],
  ["Evaluation", [
    "quality", "standard", "benefit", "serious", "successful", "effective", "positive", "appropriate",
    "critical", "obvious", "complex", "essential", "negative", "practical", "crucial", "sufficient",
    "severe", "unlikely", "ideal", "vital", "pure", "accurate", "remarkable", "adequate",
    "impressive", "maximum", "genuine", "modest", "suitable", "minimum", "precise", "reliable",
  ]],
];

const academicCategoryByWord = new Map(
  ACADEMIC_CATEGORY_WORDS.flatMap(([category, words]) => words.map((word) => [word, category] as const)),
);

const EXPANDED_ACADEMIC_WORDS: WritingWord[] = ACADEMIC_WORD_DATA.split("\n")
  .map((row) => {
    const [word, meaningZh] = row.split("\t");
    return {
      id: word,
      word,
      meaningZh,
      definition: "Common IELTS and TOEFL academic vocabulary",
      example: "",
      category: academicCategoryByWord.get(word) ?? "General academic",
    };
  })
  .filter((item) => Boolean(item.word && item.meaningZh) && !curatedIds.has(item.id));

export const writingWords: WritingWord[] = [...CURATED_WRITING_WORDS, ...EXPANDED_ACADEMIC_WORDS];

export function buildWritingWordSession<T extends { id: string }>(
  items: T[],
  limit: number,
  random: () => number = Math.random,
  excludedIds: readonly string[] = [],
) {
  const excluded = new Set(excludedIds);
  const remaining = items.filter((item) => !excluded.has(item.id));
  const shuffled = [...(remaining.length ? remaining : items)];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled.slice(0, Math.min(limit, shuffled.length));
}

export function restoreWritingWordSession<T extends { id: string }>(items: T[], ids: string[]) {
  const itemsById = new Map(items.map((item) => [item.id, item]));
  return ids.flatMap((id) => {
    const item = itemsById.get(id);
    return item ? [item] : [];
  });
}

export function advanceWritingWordCycle<T extends { id: string }>(
  items: T[],
  practicedIds: readonly string[],
  completedSessionIds: readonly string[],
) {
  const validIds = new Set(items.map((item) => item.id));
  const completedIds = new Set(practicedIds.filter((id) => validIds.has(id)));
  completedSessionIds.forEach((id) => {
    if (validIds.has(id)) completedIds.add(id);
  });
  return completedIds.size >= validIds.size ? [] : Array.from(completedIds);
}
