"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { clearSessionHint, writeSessionHint } from "@/lib/sessionHint";
import { useRefreshMutation } from "@/store/api";
import { setAuthAnonymous, setCredentials } from "@/store/authSlice";

type AuthSessionBootstrapProps = {
  children: React.ReactNode;
};

export function AuthSessionBootstrap({ children }: AuthSessionBootstrapProps) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const status = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);
  const [refresh] = useRefreshMutation();
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
    }
  }, [status, user]);

  useEffect(() => {
    if (started.current || accessToken) {
      return;
    }
    started.current = true;

    void (async () => {
      try {
        const result = await refresh().unwrap();
        dispatch(
          setCredentials({
            user: result.user,
            accessToken: result.accessToken,
          }),
        );
      } catch {
        dispatch(setAuthAnonymous());
      }
    })();
  }, [accessToken, dispatch, refresh]);

  return children;
}
