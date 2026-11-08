/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
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

function buildMenuStyle(shell: HTMLElement): CSSProperties {
  const shellRect = shell.getBoundingClientRect();
  const width = Math.min(shellRect.width, window.innerWidth - 16);
  let left = shellRect.left;
  if (left + width > window.innerWidth - 8) {
    left = Math.max(8, window.innerWidth - width - 8);
  }

  return {
    position: "fixed",
    top: shellRect.bottom + 6,
    left,
    width,
    zIndex: 80,
  };
}

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
  const shellRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);
  const [mounted, setMounted] = useState(false);

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
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return;
    }

    function updatePosition() {
      const shell = shellRef.current;
      if (!shell) {
        return;
      }
      setMenuStyle(buildMenuStyle(shell));
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !menuStyle) {
      return;
    }

    searchRef.current?.focus({ preventScroll: true });

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
      setQuery("");
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, menuStyle]);

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

  const menu =
    open && mounted && menuStyle
      ? createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-label={t("profilePhoneCountryCode")}
            style={menuStyle}
            className="glass-panel overflow-hidden rounded-xl"
          >
            <div className="border-b border-(--glass-line) p-2">
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
                  className="glass-input-control h-9 w-full rounded-lg py-0 pr-3 pl-8 [&::-webkit-search-cancel-button]:cursor-pointer"
                  onChange={(event) => {
                    setQuery(event.target.value);
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
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="flex w-full flex-col gap-1.5 text-sm">
      <label
        htmlFor={inputId}
        className="inline-flex min-h-5 flex-wrap items-baseline gap-x-1.5 font-medium text-brand-900 dark:text-brand-100"
      >
        <span>{t("profilePhone")}</span>
        <span className="text-xs font-normal text-brand-600 dark:text-brand-400">
          ({t("profilePhoneOptional")})
        </span>
      </label>

      <div
        ref={shellRef}
        className="glass-input flex items-stretch overflow-hidden p-0"
        data-open={open || undefined}
        data-invalid={Boolean(error) || undefined}
        data-disabled={disabled || undefined}
      >
        <div
          className="flex shrink-0 items-stretch"
          style={{ borderRight: "1px solid var(--glass-line-2)" }}
        >
          <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            aria-label={t("profilePhoneCountryCode")}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-invalid={Boolean(error) || undefined}
            className="glass-input-control inline-flex w-22 cursor-pointer items-center justify-between gap-1 px-2.5"
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
                "size-4 shrink-0 text-brand-600 transition-transform dark:text-brand-400",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
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
          className="glass-input-control min-w-0 flex-1 px-3"
          onChange={(event) => {
            onNationalNumberChange(event.target.value);
          }}
        />
      </div>

      {menu}

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
