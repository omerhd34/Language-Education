export type ListeningSectionTab = "audio" | "practice";

export const LISTENING_SECTION_ANCHORS = {
  audio: "listening-audio",
  practice: "listening-exercise",
} as const satisfies Record<ListeningSectionTab, string>;

const LEGACY_LISTENING_PRACTICE_HASHES = new Set(["listening-practice"]);

export function listeningSectionHeadingId(tab: ListeningSectionTab): string {
  if (tab === "audio") {
    return "listening-audio-heading";
  }
  return LISTENING_SECTION_ANCHORS[tab];
}

export function parseListeningSectionTab(
  value: string | string[] | undefined,
): ListeningSectionTab {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "practice") {
    return "practice";
  }
  return "audio";
}

export function tabFromListeningLocationHash(): ListeningSectionTab | null {
  if (typeof window === "undefined") {
    return null;
  }
  const hash = window.location.hash.replace(/^#/, "");
  if (
    hash === LISTENING_SECTION_ANCHORS.practice ||
    LEGACY_LISTENING_PRACTICE_HASHES.has(hash)
  ) {
    return "practice";
  }
  return null;
}

export function scrollToListeningSection(tab: ListeningSectionTab): void {
  const id = LISTENING_SECTION_ANCHORS[tab];
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
