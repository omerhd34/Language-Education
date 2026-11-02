"use client";

import { useEffect, useState } from "react";

const PANEL_HASH_EVENT = "pylmor:panel-hash";

export function readPanelHash(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash;
}

export function navigatePanelSection(section: string): void {
  if (typeof window === "undefined") return;

  const nextHash = section ? `#${section}` : "";
  const { pathname, search } = window.location;

  if (nextHash) {
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  } else if (window.location.hash) {
    window.history.pushState(null, "", `${pathname}${search}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  window.dispatchEvent(new Event(PANEL_HASH_EVENT));
}

export function usePanelHash(): string {
  const [hash, setHash] = useState(readPanelHash);

  useEffect(() => {
    const sync = () => setHash(readPanelHash());

    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    window.addEventListener(PANEL_HASH_EVENT, sync);

    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
      window.removeEventListener(PANEL_HASH_EVENT, sync);
    };
  }, []);

  return hash;
}
