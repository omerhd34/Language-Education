export type WritingSectionTab = "model" | "practice";

export const WRITING_SECTION_ANCHORS = {
  model: "writing-ornek",
  practice: "writing-alistirma",
} as const satisfies Record<WritingSectionTab, string>;

export function writingSectionHeadingId(tab: WritingSectionTab): string {
  if (tab === "model") {
    return "writing-ornek-heading";
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
  if (hash === WRITING_SECTION_ANCHORS.practice) {
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
