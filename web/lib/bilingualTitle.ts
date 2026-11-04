export function getDistinctSecondaryTitle(
  title: string,
  titleEn?: string | null,
): string | undefined {
  if (!titleEn) {
    return undefined;
  }

  const normalize = (value: string) =>
    value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en");

  if (normalize(title) === normalize(titleEn)) {
    return undefined;
  }

  return titleEn;
}
