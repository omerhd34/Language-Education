"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PHONE_COUNTRY_ISO,
  DEFAULT_PHONE_DIAL_CODE,
  getPhoneCountryByIso,
  PHONE_COUNTRY_CODES,
  PHONE_REGION_ORDER,
  type PhoneCountryCode,
} from "@/lib/phoneCountryCodes";

type PhoneFieldProps = {
  countryIso: string;
  nationalNumber: string;
  disabled?: boolean;
  error?: string;
  onCountryIsoChange: (iso: string) => void;
  onNationalNumberChange: (nationalNumber: string) => void;
};

const fieldClassName =
  "h-11 rounded-lg border border-brand-400/70 bg-surface text-brand-950 outline-none transition-colors focus:border-brand-800 focus:ring-2 focus:ring-brand-800/20 dark:border-brand-600 dark:bg-brand-900 dark:text-brand-100 dark:focus:border-brand-400 dark:focus:ring-brand-400/20";

export function PhoneField({
  countryIso,
  nationalNumber,
  disabled = false,
  error,
  onCountryIsoChange,
  onNationalNumberChange,
}: PhoneFieldProps) {
  const t = useTranslations("Settings");
  const reactId = useId();
  const inputId = `phone-number-${reactId}`;
  const listboxId = `phone-countries-${reactId}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected =
    getPhoneCountryByIso(countryIso) ??
    getPhoneCountryByIso(DEFAULT_PHONE_COUNTRY_ISO) ??
    PHONE_COUNTRY_CODES[0];

  const filteredCountries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr");
    if (!normalizedQuery) {
      return PHONE_COUNTRY_CODES;
    }

    return PHONE_COUNTRY_CODES.filter((country) => {
      const label = t(country.labelKey).toLocaleLowerCase("tr");
      return (
        label.includes(normalizedQuery) ||
        country.dialCode.includes(normalizedQuery) ||
        country.iso.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, t]);

  const groupedCountries = useMemo(() => {
    return PHONE_REGION_ORDER.map((region) => ({
      region,
      countries: filteredCountries.filter(
        (country) => country.region === region,
      ),
    })).filter((group) => group.countries.length > 0);
  }, [filteredCountries]);

  useEffect(() => {
    if (!open) {
      return;
    }

    searchRef.current?.focus();

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function selectCountry(country: PhoneCountryCode) {
    onCountryIsoChange(country.iso);
    setOpen(false);
    setQuery("");
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div className="flex w-full flex-col gap-1.5 text-sm">
      <label
        htmlFor={inputId}
        className="font-medium text-brand-900 dark:text-brand-100"
      >
        {`${t("profilePhone")} (${t("profilePhoneOptional")})`}
      </label>

      <div className="flex gap-2">
        <div ref={rootRef} className="relative shrink-0">
          <button
            type="button"
            disabled={disabled}
            aria-label={t("profilePhoneCountryCode")}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            className={cn(
              fieldClassName,
              "inline-flex w-22 cursor-pointer items-center justify-between gap-1 px-2 disabled:cursor-not-allowed disabled:opacity-60",
              error && "border-red-500 dark:border-red-400",
              open &&
                "border-brand-800 ring-2 ring-brand-800/20 dark:border-brand-400 dark:ring-brand-400/20",
            )}
            onClick={() => {
              setOpen((value) => !value);
            }}
            onKeyDown={handleTriggerKeyDown}
          >
            <span className="font-medium tabular-nums">
              {selected.dialCode || DEFAULT_PHONE_DIAL_CODE}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-brand-600 transition-transform dark:text-brand-400",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>

          {open ? (
            <div
              id={listboxId}
              role="listbox"
              aria-label={t("profilePhoneCountryCode")}
              className="absolute top-[calc(100%+0.35rem)] left-0 z-50 w-[min(18.5rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-brand-200 bg-background shadow-lg dark:border-brand-700 dark:bg-brand-950"
            >
              <div className="border-b border-brand-200 p-2 dark:border-brand-700">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-brand-500"
                    aria-hidden
                  />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    placeholder={t("profilePhoneCountrySearch")}
                    className="h-9 w-full rounded-lg border border-brand-300/80 bg-surface pr-3 pl-8 text-sm text-brand-950 outline-none placeholder:text-brand-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-brand-600 dark:bg-brand-900 dark:text-brand-100"
                    onChange={(event) => {
                      setQuery(event.target.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setOpen(false);
                        setQuery("");
                      }
                    }}
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto p-1.5">
                {groupedCountries.length === 0 ? (
                  <p className="px-2.5 py-3 text-xs text-brand-600 dark:text-brand-400">
                    {t("profilePhoneCountryEmpty")}
                  </p>
                ) : (
                  groupedCountries.map((group) => (
                    <div key={group.region} className="mb-1.5 last:mb-0">
                      <p className="px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide text-brand-500 uppercase dark:text-brand-400">
                        {t(`phoneRegion.${group.region}`)}
                      </p>
                      <ul className="space-y-0.5">
                        {group.countries.map((country) => {
                          const isSelected = country.iso === selected.iso;
                          return (
                            <li key={country.iso}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                className={cn(
                                  "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                                  isSelected
                                    ? "bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950"
                                    : "text-brand-950 hover:bg-sky-500/10 dark:text-brand-100 dark:hover:bg-sky-400/15",
                                )}
                                onClick={() => {
                                  selectCountry(country);
                                }}
                              >
                                <span className="w-12 shrink-0 font-medium tabular-nums">
                                  {country.dialCode}
                                </span>
                                <span className="min-w-0 flex-1 truncate">
                                  {t(country.labelKey)}
                                </span>
                                {isSelected ? (
                                  <Check
                                    className="size-3.5 shrink-0"
                                    strokeWidth={2.5}
                                    aria-hidden
                                  />
                                ) : null}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>

        <input
          id={inputId}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          disabled={disabled}
          value={nationalNumber}
          placeholder={t("profilePhonePlaceholder")}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            fieldClassName,
            "min-w-0 flex-1 px-3 placeholder:text-brand-600/60 dark:placeholder:text-brand-400/70 disabled:cursor-not-allowed disabled:opacity-60",
            error && "border-red-500 dark:border-red-400",
          )}
          onChange={(event) => {
            onNationalNumberChange(event.target.value);
          }}
        />
      </div>

      {error ? (
        <span
          id={`${inputId}-error`}
          className="text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}
