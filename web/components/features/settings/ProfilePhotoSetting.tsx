"use client";

import { useTranslations } from "next-intl";
import { Trash2, UserRound } from "lucide-react";
import { ProfileAvatar } from "@/components/features/profile/ProfileAvatar";
import { SettingsSection } from "@/components/features/settings/SettingsSection";
import { Button } from "@/components/ui/Button";
import { useProfileAvatarUpload } from "@/hooks/useProfileAvatarUpload";
import { useAuthStore } from "@/store/authStore";

export function ProfilePhotoSetting() {
  const t = useTranslations("Settings");
  const user = useAuthStore((state) => state.user);
  const { pickFile, remove, isUpdatingAvatar, error, success } =
    useProfileAvatarUpload();

  if (!user) {
    return null;
  }

  return (
    <SettingsSection
      id="profil"
      titleId="settings-profile-photo"
      title={t("profilePhoto")}
      description={t("profilePhotoHint")}
      icon={<UserRound className="size-5" aria-hidden />}
    >
      <div className="flex items-center gap-3">
        <ProfileAvatar
          name={user.name}
          email={user.email}
          avatarUrl={user.avatarUrl}
          className="size-24"
          fallbackClassName="text-lg"
          editable
          uploading={isUpdatingAvatar}
          onPickFile={pickFile}
          label={t("profilePhotoChange")}
        />

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUpdatingAvatar}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/jpeg,image/png,image/webp,image/*";
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (file) {
                    void pickFile(file);
                  }
                };
                input.click();
              }}
            >
              {t("profilePhotoChange")}
            </Button>
            {user.avatarUrl ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isUpdatingAvatar}
                onClick={() => {
                  void remove();
                }}
              >
                <Trash2 aria-hidden />
                {t("profilePhotoRemove")}
              </Button>
            ) : null}
          </div>

          {error ? (
            <p className="text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              {success}
            </p>
          ) : null}
        </div>
      </div>
    </SettingsSection>
  );
}
