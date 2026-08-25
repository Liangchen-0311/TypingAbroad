import { PASSAGE_WORD_MEANING_DATA } from "./passageWordMeanings";
import { writingWords } from "./writingWords";

const passageWordMeanings = new Map(
  PASSAGE_WORD_MEANING_DATA.trim().split("\n").map((row) => {
    const separator = row.indexOf("\t");
    return [row.slice(0, separator), row.slice(separator + 1)] as const;
  }),
);

const writingWordMeanings = new Map(writingWords.map((item) => [item.word, item.meaningZh]));

const compoundMeanings: Record<string, string> = {
  "better-rested": "休息更充分的",
  "car-free": "无汽车的",
  "clean-energy": "清洁能源的",
  "closed-book": "闭卷的",
  "four-day": "四天的",
  "full-price": "全价的",
  "low-income": "低收入的",
  "nursery-grown": "苗圃培育的",
  "slow-growing": "生长缓慢的",
  "small-group": "小组形式的",
  "solar-navigation": "太阳导航的",
  "water-quality": "水质的",
  "well-planned": "规划良好的",
};

const passagePlaceNames = new Set(["bellara", "greyhaven", "larton", "norvale"]);

export function normaliseLookupWord(word: string) {
  return word.replace(/^[^A-Za-z]+|[^A-Za-z'-]+$/g, "").toLowerCase();
}

export function getChineseWordMeaning(word: string) {
  const normalised = normaliseLookupWord(word);
  const direct = writingWordMeanings.get(normalised)
    ?? passageWordMeanings.get(normalised)
    ?? compoundMeanings[normalised];
  if (direct) return direct;

  if (normalised.endsWith("'s")) {
    const base = normalised.slice(0, -2);
    const baseMeaning = writingWordMeanings.get(base) ?? passageWordMeanings.get(base) ?? compoundMeanings[base];
    if (baseMeaning) return baseMeaning;
    if (passagePlaceNames.has(base)) return "专有名词（文章中的地名）";
  }

  if (passagePlaceNames.has(normalised)) return "专有名词（文章中的地名）";
  return undefined;
}
