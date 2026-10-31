"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useRefreshMutation } from "@/store/api";
import { setAuthAnonymous, setCredentials } from "@/store/authSlice";

type AuthSessionBootstrapProps = {
  children: React.ReactNode;
};

export function AuthSessionBootstrap({ children }: AuthSessionBootstrapProps) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [refresh] = useRefreshMutation();
  const started = useRef(false);

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
