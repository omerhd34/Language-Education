"use client";

import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useAuthAvatarSrc } from "@/hooks/useAuthAvatarSrc";
import { cn } from "@/lib/utils";
import { getUserInitials } from "@/lib/userInitials";

type ProfileAvatarProps = {
  name: string | null;
  email: string;
  avatarUrl: string | null;
  previewSrc?: string | null;
  className?: string;
  fallbackClassName?: string;
  shape?: "circle" | "rounded";
  editable?: boolean;
  uploading?: boolean;
  onPickFile?: (file: File) => void;
  label?: string;
};

export function ProfileAvatar({
  name,
  email,
  avatarUrl,
  previewSrc,
  className,
  fallbackClassName,
  shape = "circle",
  editable = false,
  uploading = false,
  onPickFile,
  label,
}: ProfileAvatarProps) {
  const remoteSrc = useAuthAvatarSrc(
    previewSrc === undefined ? avatarUrl : null,
  );
  const src = previewSrc === undefined ? remoteSrc : previewSrc;
  const initials = getUserInitials(name, email);
  const radiusClass = shape === "rounded" ? "rounded-xl" : "rounded-full";

  const avatar = (
    <Avatar className={cn("overflow-hidden", radiusClass, className)}>
      {src ? (
        <AvatarImage
          src={src}
          alt=""
          className={cn("size-full", radiusClass)}
        />
      ) : null}
      <AvatarFallback className={cn(radiusClass, fallbackClassName)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  if (!editable || !onPickFile) {
    return avatar;
  }

  return (
    <label
      className={cn(
        "group/avatar relative inline-flex shrink-0 cursor-pointer overflow-hidden focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-500/60",
        radiusClass,
        className,
        uploading && "pointer-events-none opacity-70",
      )}
    >
      <span className="sr-only">{label}</span>
      <Avatar className={cn("size-full overflow-hidden", radiusClass)}>
        {src ? (
          <AvatarImage
            src={src}
            alt=""
            className={cn("size-full", radiusClass)}
          />
        ) : null}
        <AvatarFallback className={cn(radiusClass, fallbackClassName)}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity group-hover/avatar:opacity-100 group-focus-within/avatar:opacity-100",
          radiusClass,
        )}
        aria-hidden
      >
        <Camera className="size-4" strokeWidth={1.75} />
      </span>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        className="sr-only"
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) {
            onPickFile(file);
          }
        }}
      />
    </label>
  );
}
