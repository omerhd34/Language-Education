/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogIn,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import { AuthEmailField } from "@/components/features/auth/AuthEmailField";
import { AuthFloatingField } from "@/components/features/auth/AuthFloatingField";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useRouter } from "@/i18n/navigation";
import { createLoginSchema, createRegisterSchema } from "@/lib/authValidation";
import { cn } from "@/lib/utils";
import { useLoginMutation, useRegisterMutation } from "@/store/api";
import { setCredentials } from "@/store/authSlice";

export type AuthMode = "giris" | "kayit" | "sifre";

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
  const tNav = useTranslations("Nav");
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
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  const isLoading = isLoggingIn || isRegistering;

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
    setForgotNotice(null);
    setConfirmPassword("");
    setAcceptedTerms(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  async function onLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

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

  async function onRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

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
      setFieldErrors({ confirmPassword: t("errors.passwordMismatch") });
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
  }

  function onForgotSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setForgotNotice(null);
    const parsed = registerSchema.pick({ email: true }).safeParse({ email });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({ email: flat.email?.[0] });
      return;
    }
    setFieldErrors({});
    setForgotNotice(t("forgotSoon"));
  }

  function passwordToggle(show: boolean, onToggle: () => void) {
    return (
      <button
        type="button"
        className="ixir-toggle-password"
        tabIndex={-1}
        aria-label={show ? t("hidePassword") : t("showPassword")}
        onClick={onToggle}
      >
        {show ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    );
  }

  const brand = tNav("brand");

  return (
    <div
      className={cn(
        "ixir-auth-split",
        mode === "kayit" && "is-register",
        mode === "sifre" && "is-reset",
      )}
      id="ixirAuthSplit"
    >
      <div className="ixir-auth-split-card">
        <nav className="ixir-auth-tabs" aria-label={t("loginTitle")}>
          <button
            type="button"
            className={cn("ixir-auth-tab", mode === "giris" && "is-active")}
            onClick={() => switchMode("giris")}
          >
            <LogIn className="size-4" aria-hidden />
            {t("submitLogin")}
          </button>
          <button
            type="button"
            className={cn("ixir-auth-tab", mode === "kayit" && "is-active")}
            onClick={() => switchMode("kayit")}
          >
            <UserPlus className="size-4" aria-hidden />
            {t("submitRegister")}
          </button>
        </nav>

        <div className="ixir-auth-forms">
          <div className="ixir-auth-panel ixir-auth-panel-login">
            <form
              className="ixir-split-form ixir-login-form"
              onSubmit={onLoginSubmit}
              noValidate
            >
              <div className="ixir-split-form-head">
                <h1>{t("loginTitle")}</h1>
              </div>

              <AuthEmailField
                name="email"
                label={t("email")}
                value={email}
                onChange={setEmail}
                error={fieldErrors.email}
                autoFocus
                startIcon={<Mail className="size-4" aria-hidden />}
              />

              <AuthFloatingField
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                label={t("password")}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={fieldErrors.password}
                startIcon={<Lock className="size-4" aria-hidden />}
                endIcon={passwordToggle(showPassword, () =>
                  setShowPassword((value) => !value),
                )}
              />

              <div className="ixir-split-meta">
                <label className="ixir-remember" htmlFor="rememberme">
                  <input
                    type="checkbox"
                    name="rememberme"
                    id="rememberme"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span className="ixir-remember-box" aria-hidden />
                  <span className="ixir-remember-text">{t("rememberMe")}</span>
                </label>
              </div>

              {formError && mode === "giris" ? (
                <p className="ixir-field-error" role="alert">
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                className="btn ixir-split-btn"
                disabled={isLoading}
              >
                <LogIn className="size-4" aria-hidden />
                {t("submitLogin")}
              </button>

              <div className="ixir-auth-mobile-links">
                <button
                  type="button"
                  className="ixir-split-switch-link"
                  onClick={() => switchMode("sifre")}
                >
                  {t("promoForgotTitle")}
                </button>
              </div>
            </form>
          </div>

          <div className="ixir-auth-panel ixir-auth-panel-register">
            {submittedEmail ? (
              <div className="ixir-split-form" role="status">
                <div className="ixir-split-form-head">
                  <h1>{t("checkEmailTitle")}</h1>
                  <p>{t("checkEmailBody", { email: submittedEmail })}</p>
                </div>
                <button
                  type="button"
                  className="btn ixir-split-btn"
                  onClick={() => switchMode("giris")}
                >
                  <LogIn className="size-4" aria-hidden />
                  {t("goLogin")}
                </button>
              </div>
            ) : (
              <form
                className="ixir-split-form ixir-register-form"
                onSubmit={onRegisterSubmit}
                noValidate
              >
                <div className="ixir-split-form-head">
                  <h1>{t("registerTitle")}</h1>
                </div>

                <AuthFloatingField
                  name="name"
                  type="text"
                  autoComplete="name"
                  label={t("nameOptional")}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  startIcon={<User className="size-4" aria-hidden />}
                />

                <AuthEmailField
                  name="email"
                  label={t("email")}
                  value={email}
                  onChange={setEmail}
                  error={fieldErrors.email}
                  startIcon={<Mail className="size-4" aria-hidden />}
                />

                <div className="ixir-field-row">
                  <AuthFloatingField
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    label={t("password")}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    error={fieldErrors.password}
                    startIcon={<Lock className="size-4" aria-hidden />}
                    endIcon={passwordToggle(showPassword, () =>
                      setShowPassword((value) => !value),
                    )}
                  />
                  <AuthFloatingField
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    label={t("confirmPassword")}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    error={fieldErrors.confirmPassword}
                    startIcon={<Lock className="size-4" aria-hidden />}
                    endIcon={passwordToggle(showConfirmPassword, () =>
                      setShowConfirmPassword((value) => !value),
                    )}
                  />
                </div>

                <div className="ixir-agreements">
                  <label className="ixir-check">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(event) =>
                        setAcceptedTerms(event.target.checked)
                      }
                    />
                    <span>{t("agreeTerms")}</span>
                  </label>
                  {fieldErrors.terms ? (
                    <p className="ixir-field-error" role="alert">
                      {fieldErrors.terms}
                    </p>
                  ) : null}
                </div>

                {formError && mode === "kayit" ? (
                  <p className="ixir-field-error" role="alert">
                    {formError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="btn ixir-split-btn"
                  disabled={isLoading}
                >
                  <UserPlus className="size-4" aria-hidden />
                  {t("submitRegister")}
                </button>
              </form>
            )}
          </div>

          <div className="ixir-auth-panel ixir-auth-panel-reset">
            <form
              className="ixir-split-form ixir-reset-form"
              onSubmit={onForgotSubmit}
              noValidate
            >
              <div className="ixir-split-form-head">
                <h1>{t("forgotTitle")}</h1>
                <p>{t("forgotSubtitle")}</p>
              </div>

              <AuthEmailField
                name="resetEmail"
                label={t("email")}
                value={email}
                onChange={setEmail}
                error={fieldErrors.email}
                startIcon={<Mail className="size-4" aria-hidden />}
              />

              {forgotNotice ? (
                <p
                  className="ixir-field-error"
                  role="status"
                  style={{ color: "#536684" }}
                >
                  {forgotNotice}
                </p>
              ) : null}

              <button type="submit" className="btn ixir-split-btn">
                {t("submitForgot")}
              </button>
            </form>
          </div>
        </div>

        <div className="ixir-auth-overlay">
          <div className="ixir-auth-overlay-bg" />

          <div className="ixir-auth-overlay-panel ixir-auth-overlay-left">
            <span className="ixir-overlay-logo-text">{brand}</span>
            <h2>{t("promoHasAccountTitle")}</h2>
            <p>{t("promoHasAccountBody")}</p>
            <button
              type="button"
              className="ixir-overlay-btn"
              onClick={() => switchMode("giris")}
            >
              <LogIn className="size-4" aria-hidden />
              {t("promoLogin")}
            </button>
            <div className="ixir-overlay-forgot">
              <h2>{t("promoForgotTitle")}</h2>
              <p>{t("promoForgotBody")}</p>
              <button
                type="button"
                className="ixir-overlay-btn"
                onClick={() => switchMode("sifre")}
              >
                <KeyRound className="size-4" aria-hidden />
                {t("promoForgot")}
              </button>
            </div>
          </div>

          <div className="ixir-auth-overlay-panel ixir-auth-overlay-right">
            <span className="ixir-overlay-logo-text">{brand}</span>
            <h2>{t("promoNoAccountTitle")}</h2>
            <p>{t("promoNoAccountBody")}</p>
            <button
              type="button"
              className="ixir-overlay-btn"
              onClick={() => switchMode("kayit")}
            >
              <UserPlus className="size-4" aria-hidden />
              {t("promoRegister")}
            </button>
            <div className="ixir-overlay-forgot">
              <h2>{t("promoForgotTitle")}</h2>
              <p>{t("promoForgotBody")}</p>
              <button
                type="button"
                className="ixir-overlay-btn"
                onClick={() => switchMode("sifre")}
              >
                <KeyRound className="size-4" aria-hidden />
                {t("promoForgot")}
              </button>
            </div>
          </div>

          <div className="ixir-auth-overlay-panel ixir-auth-overlay-reset">
            <span className="ixir-overlay-logo-text">{brand}</span>
            <h2>{t("promoHaveAccountTitle")}</h2>
            <p>{t("promoHaveAccountBody")}</p>
            <div className="ixir-overlay-actions">
              <button
                type="button"
                className="ixir-overlay-btn"
                onClick={() => switchMode("giris")}
              >
                <LogIn className="size-4" aria-hidden />
                {t("promoLogin")}
              </button>
              <button
                type="button"
                className="ixir-overlay-btn"
                onClick={() => switchMode("kayit")}
              >
                <UserPlus className="size-4" aria-hidden />
                {t("promoRegister")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
