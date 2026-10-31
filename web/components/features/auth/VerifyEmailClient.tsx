"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useVerifyEmailMutation } from "@/store/api";
import { setCredentials } from "@/store/authSlice";

type VerifyEmailClientProps = {
  token: string | null;
};

const startedTokens = new Set<string>();

export function VerifyEmailClient({ token }: VerifyEmailClientProps) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const existingUser = useAppSelector((state) => state.auth.user);
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (existingUser) {
      router.replace("/panelim");
    }
  }, [existingUser, router]);

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(t("verifyInvalid"));
      return;
    }

    if (startedTokens.has(token) || existingUser) {
      return;
    }
    startedTokens.add(token);

    void (async () => {
      try {
        const result = await verifyEmail({ token }).unwrap();
        dispatch(
          setCredentials({
            user: result.user,
            accessToken: result.accessToken,
          }),
        );
        setDone(true);
        router.replace("/panelim");
      } catch {
        startedTokens.delete(token);
        setError(t("verifyInvalid"));
      }
    })();
  }, [dispatch, existingUser, router, t, token, verifyEmail]);

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
        <p className="text-sm text-brand-600 dark:text-brand-400">
          <Link
            href="/panel"
            className="font-medium text-brand-800 underline-offset-2 hover:underline dark:text-brand-400"
          >
            {t("myPanel")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <p
      className="text-sm text-brand-600 dark:text-brand-400"
      aria-live="polite"
    >
      {done
        ? t("verifySuccess")
        : isLoading || token
          ? t("verifyPending")
          : null}
    </p>
  );
}
