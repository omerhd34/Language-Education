"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthFloatingFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "id" | "placeholder"
> & {
  label: string;
  error?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export function AuthFloatingField({
  label,
  error,
  startIcon,
  endIcon,
  name,
  value,
  ...props
}: AuthFloatingFieldProps) {
  const reactId = useId();
  const inputId = `${name ?? "field"}-${reactId}`;
  const filled =
    typeof value === "string" ? value.trim().length > 0 : Boolean(value);

  return (
    <div className={cn("field", error && "has-error")}>
      <div className={cn("domain-checker", error && "is-invalid has-error")}>
        <div className={cn("dc-input dc-float", endIcon && "password-wrap")}>
          {startIcon ? (
            <span className="dc-icon" aria-hidden>
              {startIcon}
            </span>
          ) : null}
          <input
            id={inputId}
            name={name}
            className={cn(
              "form-control",
              filled && "is-filled",
              error && "is-invalid",
            )}
            placeholder=" "
            value={value}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <label htmlFor={inputId} className="dc-label">
            {label}
          </label>
          {endIcon}
        </div>
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
