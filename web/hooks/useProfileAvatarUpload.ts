"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { getApiErrorCode } from "@/lib/apiClient";
import { resizeImageFileToDataUrl } from "@/lib/resizeImageToDataUrl";
import { useAuthStore } from "@/store/authStore";

export function useProfileAvatarUpload() {
  const t = useTranslations("Settings");
  const uploadAvatar = useAuthStore((state) => state.uploadAvatar);
  const removeAvatar = useAuthStore((state) => state.removeAvatar);
  const isUpdatingAvatar = useAuthStore((state) => state.isUpdatingAvatar);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const pickFile = useCallback(
    async (file: File) => {
      clearMessages();
      try {
        const dataUrl = await resizeImageFileToDataUrl(file);
        await uploadAvatar(dataUrl);
        setSuccess(t("profilePhotoUpdated"));
      } catch (uploadError) {
        const code = getApiErrorCode(uploadError);
        if (
          uploadError instanceof Error &&
          (uploadError.message === "INVALID_IMAGE_TYPE" ||
            uploadError.message === "IMAGE_TOO_LARGE" ||
            uploadError.message === "ENCODE_FAILED" ||
            uploadError.message === "CANVAS_UNSUPPORTED")
        ) {
          setError(t("profilePhotoInvalid"));
          return;
        }

        if (code === "AVATAR_TOO_LARGE" || code === "INVALID_AVATAR") {
          setError(t("profilePhotoInvalid"));
          return;
        }

        setError(t("profilePhotoError"));
      }
    },
    [clearMessages, t, uploadAvatar],
  );

  const remove = useCallback(async () => {
    clearMessages();
    try {
      await removeAvatar();
      setSuccess(t("profilePhotoRemoved"));
    } catch {
      setError(t("profilePhotoError"));
    }
  }, [clearMessages, removeAvatar, t]);

  return {
    pickFile,
    remove,
    isUpdatingAvatar,
    error,
    success,
    clearMessages,
  };
}
