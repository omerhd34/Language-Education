"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { usePanelHash } from "@/hooks/usePanelHash";
import { writeContinueActivity } from "@/lib/continueActivityStorage";
import { parseContinueActivityFromPath } from "@/lib/resolveContinueActivity";

export function ContinueActivityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hash = usePanelHash();

  useEffect(() => {
    const search = searchParams.toString();
    const activity = parseContinueActivityFromPath(
      pathname,
      search ? `?${search}` : "",
      hash,
    );
    if (!activity) {
      return;
    }
    writeContinueActivity(activity);
  }, [pathname, searchParams, hash]);

  return null;
}
