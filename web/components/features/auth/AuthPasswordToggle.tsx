"use client";

import { Eye, EyeOff } from "lucide-react";

type AuthPasswordToggleProps = {
  show: boolean;
  hideLabel: string;
  showLabel: string;
  onToggle: () => void;
};

export function AuthPasswordToggle({
  show,
  hideLabel,
  showLabel,
  onToggle,
}: AuthPasswordToggleProps) {
  return (
    <button
      type="button"
      className="toggle-password"
      tabIndex={-1}
      aria-label={show ? hideLabel : showLabel}
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
