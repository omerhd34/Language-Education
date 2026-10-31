"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link, useRouter } from "@/i18n/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createLoginSchema } from "@/lib/authValidation";
import { useLoginMutation } from "@/store/api";
import { setCredentials } from "@/store/authSlice";

function getErrorCode(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: { error?: { code?: string } } }).data?.error
      ?.code === "string"
  ) {
    return (error as { data: { error: { code: string } } }).data.error.code;
  }

  return null;
}

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        passwordRequired: t("errors.passwordRequired"),
      }),
    [t],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        email: flat.email?.[0],
        password: flat.password?.[0],
      });
      return;
    }

    setFieldErrors({});

    try {
      const result = await login(parsed.data).unwrap();
      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
        }),
      );
      router.push("/");
    } catch (error) {
      if (getErrorCode(error) === "EMAIL_NOT_VERIFIED") {
        setFormError(t("errors.emailNotVerified"));
        return;
      }

      setFormError(t("errors.generic"));
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4" noValidate>
      <Input
        name="email"
        type="email"
        autoComplete="email"
        label={t("email")}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
      />
      <Input
        name="password"
        type="password"
        autoComplete="current-password"
        label={t("password")}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
      />
      {formError ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {formError}
        </p>
      ) : null}
      <Button type="submit" disabled={isLoading} className="w-full">
        {t("submitLogin")}
      </Button>
      <p className="text-center text-sm text-brand-600 dark:text-brand-400">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-brand-800 underline-offset-2 hover:underline dark:text-brand-400"
        >
          {t("goRegister")}
        </Link>
      </p>
    </form>
  );
}
