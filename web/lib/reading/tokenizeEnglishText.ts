export type EnglishTextToken =
  | { kind: "word"; value: string; id: string }
  | { kind: "other"; value: string; id: string };

const TOKEN_PATTERN = /[A-Za-z]+(?:[''][A-Za-z]+)*|\d+|\s+|[^\sA-Za-z0-9]+/g;

export function tokenizeEnglishText(
  text: string,
  idPrefix: string,
): EnglishTextToken[] {
  const tokens: EnglishTextToken[] = [];
  let wordIndex = 0;
  let otherIndex = 0;

  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const value = match[0];
    if (/^\d+$/.test(value)) {
      tokens.push({
        kind: "other",
        value,
        id: `${idPrefix}-o-${otherIndex}`,
      });
      otherIndex += 1;
    } else if (/^[A-Za-z]/.test(value)) {
      tokens.push({
        kind: "word",
        value,
        id: `${idPrefix}-w-${wordIndex}`,
      });
      wordIndex += 1;
    } else {
      tokens.push({
        kind: "other",
        value,
        id: `${idPrefix}-o-${otherIndex}`,
      });
      otherIndex += 1;
    }
  }

  return tokens;
}

export type HighlightTextSegment = {
  text: string;
  highlightId?: string;
};

export function splitTextByHighlights(
  text: string,
  highlights: { id: string; text: string }[],
): HighlightTextSegment[] {
  if (highlights.length === 0) {
    return [{ text }];
  }

  const segments: HighlightTextSegment[] = [];
  let cursor = 0;

  const sorted = [...highlights].sort(
    (a, b) => text.indexOf(a.text) - text.indexOf(b.text),
  );

  for (const highlight of sorted) {
    const start = text.indexOf(highlight.text, cursor);
    if (start === -1) {
      continue;
    }
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start) });
    }
    segments.push({
      text: highlight.text,
      highlightId: highlight.id,
    });
    cursor = start + highlight.text.length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ text }];
}
