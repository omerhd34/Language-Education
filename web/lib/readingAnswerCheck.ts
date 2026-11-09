export function normalizeReadingAnswer(value: string): string {
  return value.trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");
}

export function isReadingAnswerAccepted(
  value: string,
  accepted: string[],
): boolean {
  const normalized = normalizeReadingAnswer(value);
  if (!normalized) {
    return false;
  }
  return accepted.some(
    (item) => normalizeReadingAnswer(item) === normalized,
  );
}
