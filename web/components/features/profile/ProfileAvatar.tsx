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
  className?: string;
  fallbackClassName?: string;
  editable?: boolean;
  uploading?: boolean;
  onPickFile?: (file: File) => void;
  label?: string;
};

export function ProfileAvatar({
  name,
  email,
  avatarUrl,
  className,
  fallbackClassName,
  editable = false,
  uploading = false,
  onPickFile,
  label,
}: ProfileAvatarProps) {
  const src = useAuthAvatarSrc(avatarUrl);
  const initials = getUserInitials(name, email);

  const avatar = (
    <Avatar className={cn("rounded-full", className)}>
      {src ? <AvatarImage src={src} alt="" className="rounded-full" /> : null}
      <AvatarFallback className={cn("rounded-full", fallbackClassName)}>
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
        "group relative inline-flex cursor-pointer rounded-full focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-500/60",
        uploading && "pointer-events-none opacity-70",
      )}
    >
      <span className="sr-only">{label}</span>
      {avatar}
      <span
        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
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
