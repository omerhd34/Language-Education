export type ReadingSectionTab = "text" | "practice";

export const READING_SECTION_ANCHORS = {
  text: "reading-metin",
  practice: "reading-alistirma",
} as const satisfies Record<ReadingSectionTab, string>;

const LEGACY_EXAM_HASH = "reading-sinav";

export function readingSectionHeadingId(tab: ReadingSectionTab): string {
  if (tab === "text") {
    return "reading-metin-heading";
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
    hash === LEGACY_EXAM_HASH
  ) {
    return "practice";
  }
  return null;
}

export function readingSectionTabHref(
  sectionId: string,
  tab: ReadingSectionTab,
): string {
  const base = `/panel/okuma/${sectionId}`;
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
