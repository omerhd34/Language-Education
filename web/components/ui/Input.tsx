import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({
  id,
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor={inputId}>
      <span className="font-medium text-brand-900 dark:text-brand-100">
        {label}
      </span>
      <input
        id={inputId}
        className={`h-11 rounded-lg border border-brand-400/70 bg-surface px-3 text-brand-950 outline-none transition-colors placeholder:text-brand-600/60 focus:border-brand-800 focus:ring-2 focus:ring-brand-800/20 dark:border-brand-600 dark:bg-brand-900 dark:text-brand-100 dark:placeholder:text-brand-400/70 dark:focus:border-brand-400 dark:focus:ring-brand-400/20 ${error ? "border-red-500 dark:border-red-400" : ""} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <span
          id={inputId ? `${inputId}-error` : undefined}
          className="text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
