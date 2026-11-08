"use client";

import { useEffect, useState } from "react";

export function useCountdown(targetIso: string | null | undefined): number {
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    setRemainingMs(getRemainingMs(targetIso));
    if (!targetIso) {
      return;
    }

    const id = window.setInterval(() => {
      setRemainingMs(getRemainingMs(targetIso));
    }, 1000);

    return () => window.clearInterval(id);
  }, [targetIso]);

  return remainingMs;
}

function getRemainingMs(targetIso: string | null | undefined): number {
  if (!targetIso) {
    return 0;
  }

  const target = Date.parse(targetIso);
  if (Number.isNaN(target)) {
    return 0;
  }

  return Math.max(0, target - Date.now());
}
