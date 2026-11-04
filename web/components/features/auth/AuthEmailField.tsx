/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { getEmailDomainSuggestions } from "@/lib/emailDomains";
import { cn } from "@/lib/utils";

type AuthEmailFieldProps = {
  name?: string;
  label: string;
  value: string;
  error?: string;
  startIcon?: ReactNode;
  autoComplete?: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
};

export function AuthEmailField({
  name = "email",
  label,
  value,
  error,
  startIcon,
  autoComplete = "email",
  autoFocus,
  onChange,
}: AuthEmailFieldProps) {
  const t = useTranslations("Auth");
  const reactId = useId();
  const inputId = `${name}-${reactId}`;
  const listboxId = `${inputId}-suggestions`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = getEmailDomainSuggestions(value);
  const showSuggestions = open && suggestions.length > 0;
  const filled = value.trim().length > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [value]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function selectSuggestion(email: string) {
    onChange(email);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + suggestions.length) % suggestions.length,
      );
      return;
    }

    if (event.key === "Enter") {
      const selected = suggestions[activeIndex];
      if (selected) {
        event.preventDefault();
        selectSuggestion(selected.email);
      }
      return;
    }

    if (event.key === "Tab") {
      const selected = suggestions[activeIndex];
      if (selected) {
        selectSuggestion(selected.email);
      }
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("ixir-field", error && "has-error")}
      style={{ position: "relative" }}
    >
      <div
        className={cn("ixir-domain-checker", error && "is-invalid has-error")}
      >
        <div className="ixir-dc-input ixir-dc-float">
          {startIcon ? (
            <span className="ixir-dc-icon" aria-hidden>
              {startIcon}
            </span>
          ) : null}
          <input
            id={inputId}
            name={name}
            type="email"
            inputMode="email"
            autoComplete={autoComplete}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoFocus={autoFocus}
            className={cn(
              "form-control",
              filled && "is-filled",
              error && "is-invalid",
            )}
            placeholder=" "
            value={value}
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              showSuggestions ? `${listboxId}-option-${activeIndex}` : undefined
            }
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            onChange={(event) => {
              onChange(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
          />
          <label htmlFor={inputId} className="ixir-dc-label">
            {label}
          </label>
        </div>
      </div>

      {showSuggestions ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t("emailDomainSuggestions")}
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-2xl border border-[#e2e8f0] bg-white py-1 shadow-lg"
          style={{ position: "absolute", left: 0, right: 0 }}
        >
          {suggestions.map((suggestion, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={suggestion.domain} role="presentation">
                <button
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={cn(
                    "flex w-full items-center gap-1 px-3 py-2.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-[#386ce0]/10 text-[#1a1f2e]"
                      : "text-[#334155] hover:bg-[#f1f5fb]",
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectSuggestion(suggestion.email);
                  }}
                >
                  <span className="text-[#8b93a3]">{suggestion.localPart}</span>
                  <span className="font-medium text-[#386ce0]">
                    @{suggestion.domain}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? (
        <p id={`${inputId}-error`} className="ixir-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
