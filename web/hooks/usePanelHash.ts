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
  const nextUrl = `${pathname}${search}${nextHash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (currentUrl !== nextUrl) {
    window.history.pushState(null, "", nextUrl);
  }

  window.dispatchEvent(new HashChangeEvent("hashchange"));
  window.dispatchEvent(new Event(PANEL_HASH_EVENT));
}

export function navigatePanelHref(href: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const hashIndex = href.indexOf("#");
  if (hashIndex < 0) {
    return false;
  }

  const path = href.slice(0, hashIndex) || "/panel";
  const section = href.slice(hashIndex + 1);
  const { pathname } = window.location;
  const onPanel = pathname === "/panel" || pathname === "/";

  if (path === "/panel" && onPanel) {
    navigatePanelSection(section);
    return true;
  }

  return false;
}

export function usePanelHash(): string {
  const [hash, setHash] = useState("");

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
