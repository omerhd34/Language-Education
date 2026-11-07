"use client";

import { useEffect, useRef } from "react";
import { clearSessionHint, writeSessionHint } from "@/lib/sessionHint";
import { useAuthStore } from "@/store/authStore";
import { useVocabularyStore } from "@/store/vocabularyStore";

type AuthSessionBootstrapProps = {
  children: React.ReactNode;
};

export function AuthSessionBootstrap({ children }: AuthSessionBootstrapProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const refresh = useAuthStore((state) => state.refresh);
  const setAnonymous = useAuthStore((state) => state.setAnonymous);
  const clearVocabulary = useVocabularyStore((state) => state.clearAll);
  const started = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && user) {
      writeSessionHint({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      return;
    }

    if (status === "anonymous") {
      clearSessionHint();
      clearVocabulary();
    }
  }, [clearVocabulary, status, user]);

  useEffect(() => {
    if (started.current || accessToken) {
      return;
    }
    started.current = true;

    void (async () => {
      try {
        await refresh();
      } catch {
        setAnonymous();
      }
    })();
  }, [accessToken, refresh, setAnonymous]);

  return children;
}
