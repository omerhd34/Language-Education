export type ListeningSectionTab = "audio" | "practice";

export const LISTENING_SECTION_ANCHORS = {
  audio: "listening-ses",
  practice: "listening-alistirma",
} as const satisfies Record<ListeningSectionTab, string>;

export function listeningSectionHeadingId(tab: ListeningSectionTab): string {
  if (tab === "audio") {
    return "listening-ses-heading";
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
  if (hash === LISTENING_SECTION_ANCHORS.practice) {
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
