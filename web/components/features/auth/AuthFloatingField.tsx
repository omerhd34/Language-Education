"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthFloatingFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "id" | "placeholder"
> & {
  label: string;
  error?: string | boolean;
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
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : null;

  return (
    <div className={cn("field", hasError && "has-error")}>
      <fieldset
        className={cn("domain-checker", hasError && "is-invalid has-error")}
      >
        <legend className="dc-notch">{label}</legend>
        <label htmlFor={inputId} className="dc-label">
          {label}
        </label>
        <div className={cn("dc-input", endIcon && "password-wrap")}>
          {startIcon ? (
            <span className="dc-icon" aria-hidden>
              {startIcon}
            </span>
          ) : null}
          <input
            id={inputId}
            name={name}
            className={cn(
              "auth-field-input",
              filled && "is-filled",
              hasError && "is-invalid",
            )}
            placeholder=" "
            value={value}
            aria-invalid={hasError}
            aria-describedby={errorMessage ? `${inputId}-error` : undefined}
            {...props}
          />
          {endIcon}
        </div>
      </fieldset>
      {errorMessage ? (
        <p id={`${inputId}-error`} className="field-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
