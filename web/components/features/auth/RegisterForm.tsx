"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link } from "@/i18n/navigation";
import { createRegisterSchema } from "@/lib/authValidation";
import { useRegisterMutation } from "@/store/api";

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

export function RegisterForm() {
  const t = useTranslations("Auth");
  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createRegisterSchema({
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        passwordRequired: t("errors.passwordRequired"),
        passwordMin: t("errors.passwordMin"),
      }),
    [t],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = schema.safeParse({ name, email, password });
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
      const payload = {
        email: parsed.data.email,
        password: parsed.data.password,
        ...(parsed.data.name ? { name: parsed.data.name } : {}),
      };
      const result = await register(payload).unwrap();
      setSubmittedEmail(result.email);
    } catch (error) {
      const code = getErrorCode(error);

      if (code === "EMAIL_EXISTS") {
        setFormError(t("errors.emailExists"));
        return;
      }

      setFormError(t("errors.generic"));
    }
  }

  if (submittedEmail) {
    return (
      <div className="space-y-4" role="status">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold text-brand-950 dark:text-brand-100">
            {t("checkEmailTitle")}
          </h1>
          <p className="text-sm text-brand-800 dark:text-brand-400">
            {t("checkEmailBody", { email: submittedEmail })}
          </p>
        </div>
        <p className="text-center text-sm text-brand-600 dark:text-brand-400">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-brand-800 underline-offset-2 hover:underline dark:text-brand-400"
          >
            {t("goLogin")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 space-y-2">
        <h1 className="font-display text-2xl font-semibold text-brand-950 dark:text-brand-100">
          {t("registerTitle")}
        </h1>
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("registerSubtitle")}
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-4"
        noValidate
      >
        <Input
          name="name"
          type="text"
          autoComplete="name"
          label={t("nameOptional")}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
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
          autoComplete="new-password"
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
          {t("submitRegister")}
        </Button>
        <p className="text-center text-sm text-brand-600 dark:text-brand-400">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-brand-800 underline-offset-2 hover:underline dark:text-brand-400"
          >
            {t("goLogin")}
          </Link>
        </p>
      </form>
    </>
  );
}
