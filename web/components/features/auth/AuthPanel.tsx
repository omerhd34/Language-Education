/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { AuthEmailField } from "@/components/features/auth/AuthEmailField";
import { AuthGlassField } from "@/components/features/auth/AuthGlassField";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useRouter } from "@/i18n/navigation";
import { createLoginSchema, createRegisterSchema } from "@/lib/authValidation";
import { cn } from "@/lib/utils";
import { useLoginMutation, useRegisterMutation } from "@/store/api";
import { setCredentials } from "@/store/authSlice";

export type AuthMode = "giris" | "kayit";

type AuthPanelProps = {
  initialMode?: AuthMode;
};

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

export function AuthPanel({ initialMode = "giris" }: AuthPanelProps) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const isLoading = isLoggingIn || isRegistering;
  const isRegister = mode === "kayit";

  useEffect(() => {
    const remembered = window.localStorage.getItem("pylmor-remember-email");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("mod") === "kayit") {
      setMode("kayit");
    }
    if (window.location.search) {
      router.replace("/panel");
    }
  }, [router]);

  const loginSchema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        passwordRequired: t("errors.passwordRequired"),
      }),
    [t],
  );

  const registerSchema = useMemo(
    () =>
      createRegisterSchema({
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        passwordRequired: t("errors.passwordRequired"),
        passwordMin: t("errors.passwordMin"),
      }),
    [t],
  );

  function switchMode(next: AuthMode) {
    setMode(next);
    setFormError(null);
    setFieldErrors({});
    setSubmittedEmail(null);
    setConfirmPassword("");
    setAcceptedTerms(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (isRegister) {
      if (!acceptedTerms) {
        setFieldErrors({ terms: t("errors.termsRequired") });
        return;
      }

      const parsed = registerSchema.safeParse({ name, email, password });
      if (!parsed.success) {
        const flat = parsed.error.flatten().fieldErrors;
        setFieldErrors({
          email: flat.email?.[0],
          password: flat.password?.[0],
        });
        return;
      }

      if (password !== confirmPassword) {
        setFieldErrors({
          confirmPassword: t("errors.passwordMismatch"),
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
        if (getErrorCode(error) === "EMAIL_EXISTS") {
          setFormError(t("errors.emailExists"));
          return;
        }
        setFormError(t("errors.generic"));
      }
      return;
    }

    const parsed = loginSchema.safeParse({ email, password });
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
      if (rememberMe) {
        window.localStorage.setItem("pylmor-remember-email", parsed.data.email);
      } else {
        window.localStorage.removeItem("pylmor-remember-email");
      }

      const result = await login(parsed.data).unwrap();
      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
        }),
      );
      router.push("/panelim");
    } catch (error) {
      if (getErrorCode(error) === "EMAIL_NOT_VERIFIED") {
        setFormError(t("errors.emailNotVerified"));
        return;
      }
      setFormError(t("errors.generic"));
    }
  }

  if (submittedEmail) {
    return (
      <div className="space-y-5" role="status">
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {t("checkEmailTitle")}
          </h1>
          <p className="text-sm text-slate-400">
            {t("checkEmailBody", { email: submittedEmail })}
          </p>
        </div>
        <p className="text-center text-sm text-slate-400">
          {t("hasAccount")}{" "}
          <button
            type="button"
            className="font-medium text-sky-400 underline-offset-2 hover:underline"
            onClick={() => switchMode("giris")}
          >
            {t("goLogin")}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {isRegister ? (
          <>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t("registerTitle")}
            </h1>
            <p className="text-sm text-slate-400">{t("registerSubtitle")}</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="text-white">{t("loginTitleLead")} </span>
              <span className="text-sky-400">{t("loginTitleAccent")}</span>
            </h1>
            <p className="text-sm text-slate-400">{t("loginSubtitle")}</p>
          </>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        {isRegister ? (
          <AuthGlassField
            name="name"
            type="text"
            autoComplete="name"
            label={t("nameOptional")}
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(event) => setName(event.target.value)}
            startIcon={<User className="size-4" aria-hidden />}
          />
        ) : null}

        <AuthEmailField
          name="email"
          label={t("email")}
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
          startIcon={<Mail className="size-4" aria-hidden />}
        />

        {isRegister ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthGlassField
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              label={t("password")}
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={fieldErrors.password}
              startIcon={<Lock className="size-4" aria-hidden />}
              endIcon={
                <button
                  type="button"
                  className="rounded-md p-1.5 text-slate-500 transition-colors hover:text-slate-300"
                  aria-label={
                    showPassword ? t("hidePassword") : t("showPassword")
                  }
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )}
                </button>
              }
            />
            <AuthGlassField
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              label={t("confirmPassword")}
              placeholder={t("passwordPlaceholder")}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={fieldErrors.confirmPassword}
              startIcon={<Lock className="size-4" aria-hidden />}
              endIcon={
                <button
                  type="button"
                  className="rounded-md p-1.5 text-slate-500 transition-colors hover:text-slate-300"
                  aria-label={
                    showConfirmPassword ? t("hidePassword") : t("showPassword")
                  }
                  onClick={() => setShowConfirmPassword((value) => !value)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )}
                </button>
              }
            />
          </div>
        ) : (
          <AuthGlassField
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            label={t("password")}
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password}
            startIcon={<Lock className="size-4" aria-hidden />}
            endIcon={
              <button
                type="button"
                className="rounded-md p-1.5 text-slate-500 transition-colors hover:text-slate-300"
                aria-label={
                  showPassword ? t("hidePassword") : t("showPassword")
                }
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            }
          />
        )}

        {isRegister ? (
          <div className="space-y-1.5">
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="accepted-terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked)}
                className="mt-0.5 border-sky-400/50 data-checked:border-sky-400 data-checked:bg-sky-400 data-checked:text-slate-950"
                aria-invalid={Boolean(fieldErrors.terms)}
              />
              <Label
                htmlFor="accepted-terms"
                className="text-sm font-normal leading-snug text-slate-400"
              >
                {t("agreeTerms")}
              </Label>
            </div>
            {fieldErrors.terms ? (
              <p className="text-xs text-red-400" role="alert">
                {fieldErrors.terms}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked)}
              className="border-sky-400/50 data-checked:border-sky-400 data-checked:bg-sky-400 data-checked:text-slate-950"
            />
            <Label
              htmlFor="remember-me"
              className="text-sm font-normal text-slate-400"
            >
              {t("rememberMe")}
            </Label>
          </div>
        )}

        {formError ? (
          <p className="text-sm text-red-400" role="alert">
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "h-12 w-full rounded-full border-transparent bg-sky-400 text-base font-semibold text-slate-950 hover:bg-sky-300",
          )}
        >
          {t("myPanel")}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400">
        {isRegister ? t("hasAccount") : t("noAccount")}{" "}
        <button
          type="button"
          className="font-medium text-sky-400 underline-offset-2 hover:underline"
          onClick={() => switchMode(isRegister ? "giris" : "kayit")}
        >
          {isRegister ? t("goLogin") : t("goRegister")}
        </button>
      </p>
    </div>
  );
}
