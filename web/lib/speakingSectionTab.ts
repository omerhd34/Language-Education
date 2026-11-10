export type SpeakingSectionTab = "model" | "practice";

export const SPEAKING_SECTION_ANCHORS = {
  model: "speaking-example",
  practice: "speaking-exercise",
} as const satisfies Record<SpeakingSectionTab, string>;

const LEGACY_SPEAKING_PRACTICE_HASHES = new Set(["speaking-practice"]);

export function speakingSectionHeadingId(tab: SpeakingSectionTab): string {
  if (tab === "model") {
    return "speaking-example-heading";
  }
  return SPEAKING_SECTION_ANCHORS[tab];
}

export function parseSpeakingSectionTab(
  value: string | string[] | undefined,
): SpeakingSectionTab {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "practice") {
    return "practice";
  }
  return "model";
}

export function tabFromSpeakingLocationHash(): SpeakingSectionTab | null {
  if (typeof window === "undefined") {
    return null;
  }
  const hash = window.location.hash.replace(/^#/, "");
  if (
    hash === SPEAKING_SECTION_ANCHORS.practice ||
    LEGACY_SPEAKING_PRACTICE_HASHES.has(hash)
  ) {
    return "practice";
  }
  return null;
}

export function scrollToSpeakingSection(tab: SpeakingSectionTab): void {
  const id = SPEAKING_SECTION_ANCHORS[tab];
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
