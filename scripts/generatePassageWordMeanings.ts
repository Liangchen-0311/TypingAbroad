import { createReadStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { articles } from "../src/lib/articles";
import { writingWords } from "../src/lib/writingWords";

const dictionaryPath = process.argv[2];
if (!dictionaryPath) throw new Error("Usage: npx tsx scripts/generatePassageWordMeanings.ts /path/to/ecdict.csv");

function parseCsvLine(line: string) {
  const fields: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      fields.push(field);
      field = "";
    } else {
      field += character;
    }
  }
  fields.push(field);
  return fields;
}

function cleanTranslation(value: string) {
  const sections = value
    .split(/\\[nr]|[\n\r]/)
    .map((section) => section.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((section) => section
      .replace(/^\[[^\]]+\]\s*/, "")
      .replace(/^(?:a|adj|adv|art|aux|conj|int|n|num|prep|pron|r|v|vi|vt)\.\s*/i, ""));
  return sections.join("；").replace(/[\t\r]+/g, " ").replace(/\s+/g, " ").trim();
}

const knownWords = new Set(writingWords.map((item) => item.word));
const passageWords = articles.flatMap((article) => article.text.toLowerCase().match(/[a-z]+(?:['-][a-z]+)*/g) ?? []);
const neededWords = new Set(passageWords
  .flatMap((word) => word.endsWith("'s") ? [word, word.slice(0, -2)] : [word])
  .filter((word) => !knownWords.has(word)));
const meanings = new Map<string, string>();
const input = createInterface({ input: createReadStream(dictionaryPath, "utf8"), crlfDelay: Infinity });
let firstLine = true;

for await (const line of input) {
  if (firstLine) {
    firstLine = false;
    continue;
  }
  const fields = parseCsvLine(line);
  const word = fields[0]?.toLowerCase();
  if (!neededWords.has(word)) continue;
  const meaning = cleanTranslation(fields[3] ?? "");
  if (meaning) meanings.set(word, meaning);
}

const rows = Array.from(meanings).sort(([a], [b]) => a.localeCompare(b));
const missing = Array.from(neededWords).filter((word) => !meanings.has(word));
const output = `// Derived from ECDICT's English-Chinese entries (MIT License).\n`
  + `// This generated subset contains only words used by TypeAbroad passages.\n`
  + `export const PASSAGE_WORD_MEANING_DATA = \`\n`
  + rows.map(([word, meaning]) => `${word}\t${meaning.replace(/\`/g, "'")}`).join("\n")
  + `\n\`;\n`;

writeFileSync(new URL("../src/lib/passageWordMeanings.ts", import.meta.url), output);
console.log(`Generated ${rows.length} meanings; ${missing.length} passage words remain unmatched.`);
if (missing.length) console.log(missing.sort().join(", "));
