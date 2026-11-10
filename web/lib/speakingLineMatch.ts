const OPTIONAL_WORDS = new Set([
  "a",
  "an",
  "the",
  "to",
  "for",
  "of",
  "and",
  "or",
  "but",
  "are",
  "is",
  "am",
  "was",
  "were",
  "be",
  "been",
  "do",
  "does",
  "did",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "my",
  "your",
  "his",
  "her",
  "its",
  "our",
  "their",
  "at",
  "in",
  "on",
  "with",
  "as",
  "so",
  "if",
  "should",
  "would",
  "could",
  "can",
  "will",
  "just",
  "then",
]);

const TOKEN_ALIASES: Record<string, readonly string[]> = {
  practise: ["practice", "practicing", "practising"],
  practice: ["practise", "practicing", "practising"],
  ok: ["okay", "okey"],
  okay: ["ok", "okey"],
  sure: ["shore"],
  talk: ["tolk"],
};

const REQUIRED_MATCH_RATIO = 0.8;

function expandContractions(text: string): string {
  const apostrophe = "[''\u2019`]";
  return text
    .replace(new RegExp(`\\bi${apostrophe}ll\\b`, "gi"), "i will")
    .replace(new RegExp(`\\bi${apostrophe}m\\b`, "gi"), "i am")
    .replace(new RegExp(`\\byou${apostrophe}re\\b`, "gi"), "you are")
    .replace(new RegExp(`\\bwe${apostrophe}re\\b`, "gi"), "we are")
    .replace(new RegExp(`\\bthey${apostrophe}re\\b`, "gi"), "they are")
    .replace(new RegExp(`\\bit${apostrophe}s\\b`, "gi"), "it is")
    .replace(new RegExp(`\\bthat${apostrophe}s\\b`, "gi"), "that is")
    .replace(new RegExp(`\\bwhat${apostrophe}s\\b`, "gi"), "what is")
    .replace(new RegExp(`\\bdon${apostrophe}t\\b`, "gi"), "do not")
    .replace(new RegExp(`\\bcan${apostrophe}t\\b`, "gi"), "cannot")
    .replace(new RegExp(`\\bwon${apostrophe}t\\b`, "gi"), "will not")
    .replace(/\byoure\b/gi, "you are")
    .replace(/\bim\b/gi, "i am")
    .replace(/\bive\b/gi, "i have")
    .replace(/\bthats\b/gi, "that is");
}

function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/[''`]/g, "").replace(/[^\w]/g, "");
}

export function normalizeSpeakingLine(text: string): string[] {
  const expanded = expandContractions(text);
  return expanded
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .split(/\s+/)
    .map(normalizeToken)
    .filter((word) => word.length > 0);
}

function variantsForToken(token: string): string[] {
  const extras = TOKEN_ALIASES[token] ?? [];
  return [token, ...extras];
}

function editDistance(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0),
  );

  for (let i = 0; i < rows; i += 1) {
    matrix[i]![0] = i;
  }
  for (let j = 0; j < cols; j += 1) {
    matrix[0]![j] = j;
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + cost,
      );
    }
  }
  return matrix[a.length]![b.length]!;
}

function fuzzyEqual(a: string, b: string): boolean {
  if (a === b) {
    return true;
  }
  if (a.length === 0 || b.length === 0) {
    return false;
  }
  if (a.length < 3 || b.length < 3) {
    return a === b;
  }
  if (a.startsWith(b) || b.startsWith(a)) {
    return true;
  }
  const maxLen = Math.max(a.length, b.length);
  return editDistance(a, b) <= (maxLen >= 6 ? 2 : 1);
}

function tokensMatch(expected: string, spoken: string): boolean {
  const expectedVariants = variantsForToken(expected);
  const spokenVariants = variantsForToken(spoken);

  for (const exp of expectedVariants) {
    for (const spk of spokenVariants) {
      if (fuzzyEqual(exp, spk)) {
        return true;
      }
    }
  }

  return false;
}

function isOptionalWord(word: string): boolean {
  return OPTIONAL_WORDS.has(word);
}

function requiredWords(words: string[]): string[] {
  return words.filter((word) => !isOptionalWord(word));
}

function countRequiredMatchesInOrder(
  expected: string[],
  spoken: string[],
): number {
  const required = requiredWords(expected);
  if (required.length === 0) {
    return 0;
  }

  let spokenIndex = 0;
  let matched = 0;

  for (const word of required) {
    while (spokenIndex < spoken.length) {
      const spokenWord = spoken[spokenIndex] ?? "";
      spokenIndex += 1;
      if (tokensMatch(word, spokenWord)) {
        matched += 1;
        break;
      }
    }
  }

  return matched;
}

export function lineSpeechMatchesExpected(
  expected: string,
  spoken: string,
): boolean {
  const expectedWords = normalizeSpeakingLine(expected);
  if (expectedWords.length === 0) {
    return false;
  }

  const spokenWords = normalizeSpeakingLine(spoken);
  if (spokenWords.length === 0) {
    return false;
  }

  const required = requiredWords(expectedWords);
  if (required.length === 0) {
    return spokenWords.length > 0;
  }

  const matchedRequired = countRequiredMatchesInOrder(
    expectedWords,
    spokenWords,
  );
  const ratio = matchedRequired / required.length;

  return ratio >= REQUIRED_MATCH_RATIO;
}
