"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link, useRouter } from "@/i18n/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createRegisterSchema } from "@/lib/authValidation";
import { useRegisterMutation } from "@/store/api";
import { setCredentials } from "@/store/authSlice";

export function RegisterForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);

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
      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
        }),
      );
      router.push("/");
    } catch {
      setFormError(t("errors.generic"));
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4" noValidate>
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
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        {t("hasAccount")}{" "}
        <Link
          href="/login"
          className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-300"
        >
          {t("goLogin")}
        </Link>
      </p>
    </form>
  );
}
