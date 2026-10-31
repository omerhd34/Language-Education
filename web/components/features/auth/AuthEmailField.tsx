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
  placeholder?: string;
  value: string;
  error?: string;
  startIcon?: ReactNode;
  autoComplete?: string;
  onChange: (value: string) => void;
};

export function AuthEmailField({
  name = "email",
  label,
  placeholder,
  value,
  error,
  startIcon,
  autoComplete = "email",
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
    <div ref={containerRef} className="relative flex w-full flex-col gap-1.5">
      <label className="flex w-full flex-col gap-1.5" htmlFor={inputId}>
        <span className="text-xs font-medium tracking-wide text-slate-400">
          {label}
        </span>
        <span
          className={cn(
            "relative flex h-11 items-center rounded-xl border border-white/10 bg-black/35 transition-colors focus-within:border-sky-400/50 focus-within:ring-2 focus-within:ring-sky-400/20",
            error &&
              "border-red-400/60 focus-within:border-red-400/70 focus-within:ring-red-400/20",
          )}
        >
          {startIcon ? (
            <span className="pointer-events-none absolute left-3 text-slate-500">
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
            placeholder={placeholder}
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
            className={cn(
              "h-full w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500",
              startIcon ? "pl-10" : "pl-3",
              "pr-3",
            )}
            onChange={(event) => {
              onChange(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
          />
        </span>
      </label>

      {showSuggestions ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t("emailDomainSuggestions")}
          className="absolute top-[calc(100%+0.35rem)] z-20 max-h-56 w-full overflow-auto rounded-xl border border-white/10 bg-[#0b1220]/95 py-1 shadow-[0_16px_40px_rgba(2,8,23,0.55)] backdrop-blur-xl"
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
                      ? "bg-sky-400/15 text-sky-200"
                      : "text-slate-300 hover:bg-white/5",
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectSuggestion(suggestion.email);
                  }}
                >
                  <span className="text-slate-400">{suggestion.localPart}</span>
                  <span className="font-medium text-sky-300">
                    @{suggestion.domain}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? (
        <span id={`${inputId}-error`} className="text-xs text-red-400">
          {error}
        </span>
      ) : null}
    </div>
  );
}
