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
};

export function AuthGlassField({
  id,
  label,
  error,
  startIcon,
  endIcon,
  ...props
}: AuthGlassFieldProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-1.5" htmlFor={inputId}>
      <span className="text-xs font-medium tracking-wide text-slate-400">
        {label}
      </span>
      <span
        className={cn(
          "relative flex h-11 items-center rounded-xl border border-white/10 bg-black/35 transition-colors focus-within:border-sky-400/50 focus-within:ring-2 focus-within:ring-sky-400/20",
          error && "border-red-400/60 focus-within:border-red-400/70 focus-within:ring-red-400/20",
        )}
      >
        {startIcon ? (
          <span className="pointer-events-none absolute left-3 text-slate-500">
            {startIcon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={cn(
            "h-full w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500",
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
          className="text-xs text-red-400"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
