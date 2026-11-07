/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function useAuthAvatarSrc(avatarUrl: string | null | undefined) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!avatarUrl || !accessToken) {
      setSrc(null);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    void (async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}${avatarUrl}`, {
          method: "GET",
          credentials: "include",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok || cancelled) {
          return;
        }

        const blob = await response.blob();
        if (cancelled) {
          return;
        }

        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      } catch {
        if (!cancelled) {
          setSrc(null);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [accessToken, avatarUrl]);

  return src;
}
