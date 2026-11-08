"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthGlassFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  label: string;
  error?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: "light" | "dark";
};

export function AuthGlassField({
  id,
  label,
  error,
  startIcon,
  endIcon,
  variant = "light",
  ...props
}: AuthGlassFieldProps) {
  const inputId = id ?? props.name;
  const isLight = variant === "light";

  return (
    <label className="flex w-full flex-col gap-1.5" htmlFor={inputId}>
      <span
        className={cn(
          "text-xs font-medium tracking-wide",
          isLight ? "text-brand-600" : "text-slate-400",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "relative flex h-11 items-center rounded-lg border transition-colors",
          isLight
            ? "border-brand-100 bg-auth-field-bg focus-within:border-auth-accent/70 focus-within:ring-2 focus-within:ring-auth-accent/15"
            : "border-white/10 bg-black/35 focus-within:border-sky-400/50 focus-within:ring-2 focus-within:ring-sky-400/20",
          error &&
            (isLight
              ? "border-red-400 focus-within:border-red-400 focus-within:ring-red-400/20"
              : "border-red-400/60 focus-within:border-red-400/70 focus-within:ring-red-400/20"),
        )}
      >
        {startIcon ? (
          <span
            className={cn(
              "pointer-events-none absolute left-3",
              isLight ? "text-brand-400" : "text-slate-500",
            )}
          >
            {startIcon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={cn(
            "h-full w-full bg-transparent text-sm outline-none",
            isLight
              ? "text-brand-950 placeholder:text-brand-400"
              : "text-slate-100 placeholder:text-slate-500",
            startIcon ? "pl-10" : "pl-3",
            endIcon ? "pr-10" : "pr-3",
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />
        {endIcon ? (
          <span className="absolute right-2 flex items-center">{endIcon}</span>
        ) : null}
      </span>
      {error ? (
        <span
          id={inputId ? `${inputId}-error` : undefined}
          className={cn("text-xs", isLight ? "text-red-600" : "text-red-400")}
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
