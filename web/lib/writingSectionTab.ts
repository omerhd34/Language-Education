export type WritingSectionTab = "model" | "practice";

export const WRITING_SECTION_ANCHORS = {
  model: "writing-example",
  practice: "writing-exercise",
} as const satisfies Record<WritingSectionTab, string>;

const LEGACY_WRITING_PRACTICE_HASHES = new Set(["writing-practice"]);

export function writingSectionHeadingId(tab: WritingSectionTab): string {
  if (tab === "model") {
    return "writing-example-heading";
  }
  return WRITING_SECTION_ANCHORS[tab];
}

export function parseWritingSectionTab(
  value: string | string[] | undefined,
): WritingSectionTab {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "practice") {
    return "practice";
  }
  return "model";
}

export function tabFromWritingLocationHash(): WritingSectionTab | null {
  if (typeof window === "undefined") {
    return null;
  }
  const hash = window.location.hash.replace(/^#/, "");
  if (
    hash === WRITING_SECTION_ANCHORS.practice ||
    LEGACY_WRITING_PRACTICE_HASHES.has(hash)
  ) {
    return "practice";
  }
  return null;
}

export function scrollToWritingSection(tab: WritingSectionTab): void {
  const id = WRITING_SECTION_ANCHORS[tab];
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
