import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  endIcon?: ReactNode;
};

export function Input({
  id,
  label,
  error,
  endIcon,
  className = "",
  disabled,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="flex w-full flex-col gap-1.5 text-sm">
      <label
        htmlFor={inputId}
        className="inline-flex min-h-5 items-center font-medium text-brand-900 dark:text-brand-100"
      >
        {label}
      </label>
      <div
        className={cn("glass-input", endIcon && "pr-1")}
        data-invalid={Boolean(error) || undefined}
        data-disabled={disabled || undefined}
      >
        <input
          id={inputId}
          disabled={disabled}
          className={cn(
            "glass-input-control w-full px-3",
            endIcon && "pr-11",
            className,
          )}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />
        {endIcon ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
            {endIcon}
          </div>
        ) : null}
      </div>
      {error ? (
        <span
          id={inputId ? `${inputId}-error` : undefined}
          className="text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}
