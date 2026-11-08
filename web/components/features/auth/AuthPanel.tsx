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
import { useRouter } from "@/i18n/navigation";
import { getApiErrorCode } from "@/lib/apiClient";
import { createLoginSchema, createRegisterSchema } from "@/lib/authValidation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

export type AuthMode = "giris" | "kayit" | "sifre";

type AuthPanelProps = {
  initialMode?: AuthMode;
};

export function AuthPanel({ initialMode = "giris" }: AuthPanelProps) {
  const t = useTranslations("Auth");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const authStatus = useAuthStore((state) => state.status);
  const authUser = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const isRegistering = useAuthStore((state) => state.isRegistering);

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
  const [loginPressed, setLoginPressed] = useState(false);

  const isLoading = isLoggingIn || isRegistering;

  function pulseLoginButton() {
    setLoginPressed(false);
    window.requestAnimationFrame(() => {
      setLoginPressed(true);
    });
  }

  useEffect(() => {
    if (authStatus === "authenticated" && authUser) {
      router.replace("/panel");
      return;
    }

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
      router.replace("/panelLogin");
    }
  }, [authStatus, authUser, router]);

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
    pulseLoginButton();
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

      await login(parsed.data);
      router.push("/panel");
    } catch (error) {
      if (getApiErrorCode(error) === "EMAIL_NOT_VERIFIED") {
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
      const result = await register(payload);
      setSubmittedEmail(result.email);
    } catch (error) {
      if (getApiErrorCode(error) === "EMAIL_EXISTS") {
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
        className="toggle-password"
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
        "auth-split",
        mode === "kayit" && "is-register",
        mode === "sifre" && "is-reset",
      )}
    >
      <div className="auth-split-card backdrop-blur-[20px] backdrop-saturate-200">
        <nav className="auth-tabs" aria-label={t("loginTitle")}>
          <button
            type="button"
            className={cn("auth-tab", mode === "giris" && "is-active")}
            onClick={() => switchMode("giris")}
          >
            <LogIn className="size-4" aria-hidden />
            {t("submitLogin")}
          </button>
          <button
            type="button"
            className={cn("auth-tab", mode === "kayit" && "is-active")}
            onClick={() => switchMode("kayit")}
          >
            <UserPlus className="size-4" aria-hidden />
            {t("submitRegister")}
          </button>
        </nav>

        <div className="auth-forms">
          <div className="auth-panel auth-panel-login">
            <form
              className="split-form login-form"
              onSubmit={onLoginSubmit}
              noValidate
            >
              <div className="split-form-head">
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

              <div className="split-meta">
                <label className="remember" htmlFor="rememberme">
                  <input
                    type="checkbox"
                    name="rememberme"
                    id="rememberme"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span className="remember-box" aria-hidden />
                  <span className="remember-text">{t("rememberMe")}</span>
                </label>
              </div>

              {formError && mode === "giris" ? (
                <p className="field-error" role="alert">
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                className={cn("btn split-btn", loginPressed && "is-pressed")}
                disabled={isLoading}
                onAnimationEnd={(event) => {
                  if (event.animationName === "loginPress") {
                    setLoginPressed(false);
                  }
                }}
              >
                <LogIn className="size-4" aria-hidden />
                {t("submitLogin")}
              </button>

              <div className="auth-mobile-links">
                <button
                  type="button"
                  className="split-switch-link"
                  onClick={() => switchMode("sifre")}
                >
                  {t("promoForgotTitle")}
                </button>
              </div>
            </form>
          </div>

          <div className="auth-panel auth-panel-register">
            {submittedEmail ? (
              <div className="split-form" role="status">
                <div className="split-form-head">
                  <h1>{t("checkEmailTitle")}</h1>
                  <p>{t("checkEmailBody", { email: submittedEmail })}</p>
                </div>
                <button
                  type="button"
                  className="btn split-btn"
                  onClick={() => switchMode("giris")}
                >
                  <LogIn className="size-4" aria-hidden />
                  {t("goLogin")}
                </button>
              </div>
            ) : (
              <form
                className="split-form register-form"
                onSubmit={onRegisterSubmit}
                noValidate
              >
                <div className="split-form-head">
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

                <div className="field-row">
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

                <div className="agreements">
                  <label className="check">
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
                    <p className="field-error" role="alert">
                      {fieldErrors.terms}
                    </p>
                  ) : null}
                </div>

                {formError && mode === "kayit" ? (
                  <p className="field-error" role="alert">
                    {formError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="btn split-btn"
                  disabled={isLoading}
                >
                  <UserPlus className="size-4" aria-hidden />
                  {t("submitRegister")}
                </button>
              </form>
            )}
          </div>

          <div className="auth-panel auth-panel-reset">
            <form
              className="split-form reset-form"
              onSubmit={onForgotSubmit}
              noValidate
            >
              <div className="split-form-head">
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
                  className="field-error"
                  role="status"
                  style={{ color: "#536684" }}
                >
                  {forgotNotice}
                </p>
              ) : null}

              <button type="submit" className="btn split-btn">
                {t("submitForgot")}
              </button>
            </form>
          </div>
        </div>

        <div className="auth-overlay">
          <div className="auth-overlay-bg" />

          <div className="auth-overlay-panel auth-overlay-left">
            <span className="overlay-logo-text">{brand}</span>
            <h2>{t("promoHasAccountTitle")}</h2>
            <p>{t("promoHasAccountBody")}</p>
            <button
              type="button"
              className="overlay-btn"
              onClick={() => switchMode("giris")}
            >
              <LogIn className="size-4" aria-hidden />
              {t("promoLogin")}
            </button>
            <div className="overlay-forgot">
              <h2>{t("promoForgotTitle")}</h2>
              <p>{t("promoForgotBody")}</p>
              <button
                type="button"
                className="overlay-btn"
                onClick={() => switchMode("sifre")}
              >
                <KeyRound className="size-4" aria-hidden />
                {t("promoForgot")}
              </button>
            </div>
          </div>

          <div className="auth-overlay-panel auth-overlay-right">
            <span className="overlay-logo-text">{brand}</span>
            <h2>{t("promoNoAccountTitle")}</h2>
            <p>{t("promoNoAccountBody")}</p>
            <button
              type="button"
              className="overlay-btn"
              onClick={() => switchMode("kayit")}
            >
              <UserPlus className="size-4" aria-hidden />
              {t("promoRegister")}
            </button>
            <div className="overlay-forgot">
              <h2>{t("promoForgotTitle")}</h2>
              <p>{t("promoForgotBody")}</p>
              <button
                type="button"
                className="overlay-btn"
                onClick={() => switchMode("sifre")}
              >
                <KeyRound className="size-4" aria-hidden />
                {t("promoForgot")}
              </button>
            </div>
          </div>

          <div className="auth-overlay-panel auth-overlay-reset">
            <span className="overlay-logo-text">{brand}</span>
            <h2>{t("promoHaveAccountTitle")}</h2>
            <p>{t("promoHaveAccountBody")}</p>
            <div className="overlay-actions">
              <button
                type="button"
                className="overlay-btn"
                onClick={() => switchMode("giris")}
              >
                <LogIn className="size-4" aria-hidden />
                {t("promoLogin")}
              </button>
              <button
                type="button"
                className="overlay-btn"
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
