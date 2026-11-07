"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "role" | "type"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "default";
};

function Switch({
  className,
  checked = false,
  defaultChecked,
  onCheckedChange,
  disabled,
  size = "default",
  id,
  ...props
}: SwitchProps) {
  const isChecked = checked ?? Boolean(defaultChecked);

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      data-slot="switch"
      data-size={size}
      data-checked={isChecked ? "" : undefined}
      data-unchecked={isChecked ? undefined : ""}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full outline-none",
        "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isChecked
          ? "bg-sky-600 dark:bg-sky-500"
          : "bg-brand-200 dark:bg-brand-700",
        size === "sm" ? "h-7 w-12 p-0.5" : "h-8 w-14 p-1",
        className,
      )}
      onClick={() => {
        if (disabled) {
          return;
        }
        onCheckedChange?.(!isChecked);
      }}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-md ring-1 ring-black/5",
          "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
          "dark:ring-black/20",
          size === "sm" ? "size-6" : "size-6",
          isChecked
            ? size === "sm"
              ? "translate-x-5"
              : "translate-x-6"
            : "translate-x-0",
        )}
      />
    </button>
  );
}

export { Switch };
