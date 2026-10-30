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
      <span className="font-medium text-zinc-800 dark:text-zinc-100">{label}</span>
      <input
        id={inputId}
        className={`h-11 rounded-lg border border-zinc-300 bg-white px-3 text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/20 ${error ? "border-red-500 dark:border-red-400" : ""} ${className}`}
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
