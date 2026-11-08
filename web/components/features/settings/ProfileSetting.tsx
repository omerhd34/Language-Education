/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Trash2, UserRound } from "lucide-react";
import { ProfileAvatar } from "@/components/features/profile/ProfileAvatar";
import { PhoneField } from "@/components/features/settings/PhoneField";
import { SettingsSection } from "@/components/features/settings/SettingsSection";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/toast";
import {
  getPhoneCountryByIso,
  isValidNationalNumber,
  joinPhoneNumber,
  splitPhoneNumber,
} from "@/lib/phoneCountryCodes";
import { resizeImageFileToDataUrl } from "@/lib/resizeImageToDataUrl";
import { splitDisplayName } from "@/lib/splitDisplayName";
import { useAuthStore } from "@/store/authStore";

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

type PendingAvatar =
  | { type: "unchanged" }
  | { type: "upload"; dataUrl: string }
  | { type: "remove" };

export function ProfileSetting() {
  const t = useTranslations("Settings");
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const uploadAvatar = useAuthStore((state) => state.uploadAvatar);
  const removeAvatar = useAuthStore((state) => state.removeAvatar);
  const isUpdatingProfile = useAuthStore((state) => state.isUpdatingProfile);
  const isUpdatingAvatar = useAuthStore((state) => state.isUpdatingAvatar);

  const initialName = splitDisplayName(user?.name);
  const initialPhone = splitPhoneNumber(user?.phone);
  const [firstName, setFirstName] = useState(initialName.firstName);
  const [lastName, setLastName] = useState(initialName.lastName);
  const [phoneCountryIso, setPhoneCountryIso] = useState(initialPhone.iso);
  const [phoneNational, setPhoneNational] = useState(
    initialPhone.nationalNumber,
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [profileError, setProfileError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [pendingAvatar, setPendingAvatar] = useState<PendingAvatar>({
    type: "unchanged",
  });
  const [isPreparingAvatar, setIsPreparingAvatar] = useState(false);

  useEffect(() => {
    const next = splitDisplayName(user?.name);
    const nextPhone = splitPhoneNumber(user?.phone);
    setFirstName(next.firstName);
    setLastName(next.lastName);
    setPhoneCountryIso(nextPhone.iso);
    setPhoneNational(nextPhone.nationalNumber);
  }, [user?.name, user?.phone]);

  if (!user) {
    return null;
  }

  const isSaving = isUpdatingProfile || isUpdatingAvatar || isPreparingAvatar;
  const previewSrc =
    pendingAvatar.type === "upload"
      ? pendingAvatar.dataUrl
      : pendingAvatar.type === "remove"
        ? null
        : undefined;
  const canRemovePhoto =
    pendingAvatar.type === "upload" ||
    (pendingAvatar.type !== "remove" && Boolean(user.avatarUrl));

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedNational = phoneNational.trim();

    if (!trimmedFirstName) {
      errors.firstName = t("profileFirstNameRequired");
    }

    if (!trimmedLastName) {
      errors.lastName = t("profileLastNameRequired");
    } else if (/\s/.test(trimmedLastName)) {
      errors.lastName = t("profileLastNameSingleWord");
    }

    if (trimmedNational && !isValidNationalNumber(trimmedNational)) {
      errors.phone = t("profilePhoneInvalid");
    }

    return errors;
  }

  async function handlePickFile(file: File) {
    setAvatarError(null);
    setIsPreparingAvatar(true);
    try {
      const dataUrl = await resizeImageFileToDataUrl(file);
      setPendingAvatar({ type: "upload", dataUrl });
    } catch {
      setAvatarError(t("profilePhotoInvalid"));
    } finally {
      setIsPreparingAvatar(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      return;
    }

    setProfileError(null);
    setAvatarError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const nextFirstName = firstName.trim();
    const nextLastName = lastName.trim();
    const dialCode =
      getPhoneCountryByIso(phoneCountryIso)?.dialCode ?? initialPhone.dialCode;
    const nextPhone = joinPhoneNumber(dialCode, phoneNational) ?? "";
    const currentName = splitDisplayName(user.name);
    const nameChanged =
      nextFirstName !== currentName.firstName ||
      nextLastName !== currentName.lastName;
    const phoneChanged = nextPhone !== (user.phone ?? "");
    const avatarChanged = pendingAvatar.type !== "unchanged";

    if (!nameChanged && !phoneChanged && !avatarChanged) {
      setFieldErrors({});
      return;
    }

    try {
      if (nameChanged || phoneChanged) {
        await updateProfile({
          firstName: nextFirstName,
          lastName: nextLastName,
          phone: nextPhone,
        });
      }

      if (pendingAvatar.type === "upload") {
        await uploadAvatar(pendingAvatar.dataUrl);
      } else if (pendingAvatar.type === "remove") {
        await removeAvatar();
      }

      setPendingAvatar({ type: "unchanged" });
      setFieldErrors({});
      toast.add({
        id: "profile-update-success",
        type: "success",
        title: t("profileUpdateSuccess"),
      });
    } catch {
      setProfileError(t("profileUpdateError"));
    }
  }

  return (
    <SettingsSection
      id="profil"
      titleId="settings-profile"
      title={t("profile")}
      description={
        <>
          <span>{t("profileHint")}</span>
          <span> {t("profilePhotoSpec")}</span>
        </>
      }
      icon={<UserRound className="size-5" aria-hidden />}
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid items-start gap-3 sm:grid-cols-2">
          <Input
            name="firstName"
            type="text"
            autoComplete="given-name"
            label={t("profileFirstName")}
            value={firstName}
            disabled={isSaving}
            error={fieldErrors.firstName}
            onChange={(event) => {
              setFirstName(event.target.value);
            }}
          />
          <Input
            name="lastName"
            type="text"
            autoComplete="family-name"
            label={t("profileLastName")}
            value={lastName}
            disabled={isSaving}
            error={fieldErrors.lastName}
            onChange={(event) => {
              setLastName(event.target.value);
            }}
          />
          <div className="flex flex-col gap-1.5">
            <Input
              name="email"
              type="email"
              autoComplete="email"
              label={t("profileEmail")}
              value={user.email}
              readOnly
              disabled
              aria-describedby="settings-profile-email-hint"
            />
            <p
              id="settings-profile-email-hint"
              className="text-xs text-brand-600 dark:text-brand-400"
            >
              {t("profileEmailReadonly")}
            </p>
          </div>
          <PhoneField
            countryIso={phoneCountryIso}
            nationalNumber={phoneNational}
            disabled={isSaving}
            error={fieldErrors.phone}
            onCountryIsoChange={setPhoneCountryIso}
            onNationalNumberChange={setPhoneNational}
          />
        </div>

        <div className="rounded-2xl border border-brand-200/80 bg-surface-muted/60 p-3 sm:p-4 dark:border-brand-700/70 dark:bg-brand-950/40">
          <div className="flex items-center gap-3 sm:gap-4">
            <ProfileAvatar
              name={user.name}
              email={user.email}
              avatarUrl={user.avatarUrl}
              previewSrc={previewSrc}
              shape="rounded"
              className="aspect-square size-24 ring-1 ring-brand-900/10 sm:size-28 dark:ring-white/10"
              fallbackClassName="text-lg"
              editable
              uploading={isSaving}
              onPickFile={handlePickFile}
              label={t("profilePhotoChange")}
            />

            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 bg-background"
                disabled={isSaving}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/jpeg,image/png,image/webp,image/*";
                  input.onchange = () => {
                    const file = input.files?.[0];
                    if (file) {
                      void handlePickFile(file);
                    }
                  };
                  input.click();
                }}
              >
                <ImagePlus aria-hidden />
                {t("profilePhotoChange")}
              </Button>
              {canRemovePhoto ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-9"
                  disabled={isSaving}
                  onClick={() => {
                    setAvatarError(null);
                    setPendingAvatar({ type: "remove" });
                  }}
                >
                  <Trash2 aria-hidden />
                  {t("profilePhotoRemove")}
                </Button>
              ) : null}

              {avatarError ? (
                <p
                  className="text-xs text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {avatarError}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {profileError ? (
          <p className="text-sm text-destructive" role="alert">
            {profileError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSaving}
          className="h-10 w-full sm:w-auto"
        >
          {isSaving ? t("profileUpdateSubmitting") : t("profileUpdateSubmit")}
        </Button>
      </form>
    </SettingsSection>
  );
}
