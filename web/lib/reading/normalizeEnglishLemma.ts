export function normalizeEnglishLemma(token: string): string {
  const trimmed = token.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, "");
  if (!trimmed) {
    return "";
  }
  const withoutPossessive = trimmed.replace(/['']s$/i, "");
  return withoutPossessive.toLowerCase();
}
