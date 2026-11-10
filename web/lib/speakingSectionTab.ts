export type SpeakingSectionTab = "model" | "practice";

export const SPEAKING_SECTION_ANCHORS = {
  model: "konusma-ornek",
  practice: "konusma-alistirma",
} as const satisfies Record<SpeakingSectionTab, string>;

export function speakingSectionHeadingId(tab: SpeakingSectionTab): string {
  if (tab === "model") {
    return "konusma-ornek-heading";
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
  if (hash === SPEAKING_SECTION_ANCHORS.practice) {
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
