export type ReadingSectionTab = "text" | "practice";

export const READING_SECTION_ANCHORS = {
  text: "reading-text",
  practice: "reading-exercise",
} as const satisfies Record<ReadingSectionTab, string>;

const LEGACY_PRACTICE_HASHES = new Set([
  "reading-practice",
  "reading-sinav",
  "reading-exam",
]);

export function isReadingPracticeHash(hashId: string): boolean {
  return (
    hashId === READING_SECTION_ANCHORS.practice ||
    LEGACY_PRACTICE_HASHES.has(hashId)
  );
}
export function readingSectionHeadingId(tab: ReadingSectionTab): string {
  if (tab === "text") {
    return "reading-text-heading";
  }
  return READING_SECTION_ANCHORS[tab];
}

export function parseReadingSectionTab(
  value: string | string[] | undefined,
): ReadingSectionTab {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "practice" || raw === "exam") {
    return "practice";
  }
  return "text";
}

export function tabFromLocationHash(): ReadingSectionTab | null {
  if (typeof window === "undefined") {
    return null;
  }
  const hash = window.location.hash.replace(/^#/, "");
  if (
    hash === READING_SECTION_ANCHORS.practice ||
    LEGACY_PRACTICE_HASHES.has(hash)
  ) {
    return "practice";
  }
  return null;
}

export function readingSectionTabHref(
  sectionId: string,
  tab: ReadingSectionTab,
): string {
  const base = `/panel/reading/${sectionId}`;
  return `${base}#${READING_SECTION_ANCHORS[tab]}`;
}

export function scrollToReadingSection(tab: ReadingSectionTab): void {
  const id = READING_SECTION_ANCHORS[tab];
  const target = document.getElementById(id);
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });

  const next = `${window.location.pathname}${window.location.search}#${id}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (current !== next) {
    window.history.replaceState(null, "", next);
  }
}
