"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SettingsSection } from "@/components/features/settings/SettingsSection";
import { getApiErrorCode } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";

type FieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export function ChangePasswordPanel() {
  const t = useTranslations("Settings");
  const tAuth = useTranslations("Auth");
  const changePassword = useAuthStore((state) => state.changePassword);
  const isLoading = useAuthStore((state) => state.isChangingPassword);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function passwordToggle(show: boolean, onToggle: () => void) {
    return (
      <button
        type="button"
        tabIndex={-1}
        disabled={isLoading}
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-brand-500 transition-colors hover:bg-brand-100 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-800/20 disabled:pointer-events-none disabled:opacity-50 dark:text-brand-400 dark:hover:bg-brand-800 dark:hover:text-brand-100 dark:focus-visible:ring-brand-400/20"
        aria-label={show ? tAuth("hidePassword") : tAuth("showPassword")}
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

  function validate(): FieldErrors {
    const errors: FieldErrors = {};

    if (!currentPassword) {
      errors.currentPassword = t("passwordCurrentRequired");
    }

    if (!newPassword) {
      errors.newPassword = t("passwordNewRequired");
    } else if (newPassword.length < 8) {
      errors.newPassword = t("passwordNewMin");
    } else if (currentPassword && newPassword === currentPassword) {
      errors.newPassword = t("passwordSameAsCurrent");
    }

    if (!confirmPassword) {
      errors.confirmPassword = t("passwordConfirmRequired");
    } else if (newPassword && confirmPassword !== newPassword) {
      errors.confirmPassword = t("passwordMismatch");
    }

    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);
    setFormError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors({});
      setSuccess(true);
    } catch (error) {
      const code = getApiErrorCode(error);
      if (code === "INVALID_CURRENT_PASSWORD") {
        setFieldErrors({ currentPassword: t("passwordCurrentIncorrect") });
        return;
      }
      if (code === "SAME_PASSWORD") {
        setFieldErrors({ newPassword: t("passwordSameAsCurrent") });
        return;
      }
      setFormError(t("passwordChangeError"));
    }
  }

  return (
    <SettingsSection
      titleId="settings-change-password"
      title={t("passwordChangeTitle")}
      description={t("passwordChangeSubtitle")}
      icon={<KeyRound className="size-5" aria-hidden />}
    >
      <form className="space-y-3" onSubmit={handleSubmit} noValidate>
        <Input
          name="currentPassword"
          type={showCurrentPassword ? "text" : "password"}
          autoComplete="current-password"
          label={t("passwordCurrent")}
          value={currentPassword}
          disabled={isLoading}
          error={fieldErrors.currentPassword}
          endIcon={passwordToggle(showCurrentPassword, () =>
            setShowCurrentPassword((value) => !value),
          )}
          onChange={(event) => {
            setCurrentPassword(event.target.value);
            setSuccess(false);
          }}
        />
        <Input
          name="newPassword"
          type={showNewPassword ? "text" : "password"}
          autoComplete="new-password"
          label={t("passwordNew")}
          value={newPassword}
          disabled={isLoading}
          error={fieldErrors.newPassword}
          endIcon={passwordToggle(showNewPassword, () =>
            setShowNewPassword((value) => !value),
          )}
          onChange={(event) => {
            setNewPassword(event.target.value);
            setSuccess(false);
          }}
        />
        <Input
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          label={t("passwordConfirm")}
          value={confirmPassword}
          disabled={isLoading}
          error={fieldErrors.confirmPassword}
          endIcon={passwordToggle(showConfirmPassword, () =>
            setShowConfirmPassword((value) => !value),
          )}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setSuccess(false);
          }}
        />

        {formError ? (
          <p className="text-sm text-destructive" role="alert">
            {formError}
          </p>
        ) : null}

        {success ? (
          <p
            className="text-sm text-emerald-700 dark:text-emerald-300"
            role="status"
          >
            {t("passwordChangeSuccess")}
          </p>
        ) : null}

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading
            ? t("passwordChangeSubmitting")
            : t("passwordChangeSubmit")}
        </Button>
      </form>
    </SettingsSection>
  );
}
