export type PhoneCountryRegion =
  | "europe"
  | "asia"
  | "americas"
  | "africa"
  | "oceania";

export type PhoneCountryCode = {
  dialCode: string;
  iso: string;
  region: PhoneCountryRegion;
  labelKey: string;
};

export const DEFAULT_PHONE_COUNTRY_ISO = "TR";
export const DEFAULT_PHONE_DIAL_CODE = "+90";

export const PHONE_COUNTRY_CODES: readonly PhoneCountryCode[] = [
  { dialCode: "+90", iso: "TR", region: "europe", labelKey: "phoneCountryTR" },
  { dialCode: "+49", iso: "DE", region: "europe", labelKey: "phoneCountryDE" },
  { dialCode: "+44", iso: "GB", region: "europe", labelKey: "phoneCountryGB" },
  { dialCode: "+33", iso: "FR", region: "europe", labelKey: "phoneCountryFR" },
  { dialCode: "+39", iso: "IT", region: "europe", labelKey: "phoneCountryIT" },
  { dialCode: "+34", iso: "ES", region: "europe", labelKey: "phoneCountryES" },
  { dialCode: "+31", iso: "NL", region: "europe", labelKey: "phoneCountryNL" },
  { dialCode: "+32", iso: "BE", region: "europe", labelKey: "phoneCountryBE" },
  { dialCode: "+41", iso: "CH", region: "europe", labelKey: "phoneCountryCH" },
  { dialCode: "+43", iso: "AT", region: "europe", labelKey: "phoneCountryAT" },
  { dialCode: "+46", iso: "SE", region: "europe", labelKey: "phoneCountrySE" },
  { dialCode: "+47", iso: "NO", region: "europe", labelKey: "phoneCountryNO" },
  { dialCode: "+45", iso: "DK", region: "europe", labelKey: "phoneCountryDK" },
  { dialCode: "+30", iso: "GR", region: "europe", labelKey: "phoneCountryGR" },
  { dialCode: "+359", iso: "BG", region: "europe", labelKey: "phoneCountryBG" },
  { dialCode: "+40", iso: "RO", region: "europe", labelKey: "phoneCountryRO" },
  { dialCode: "+48", iso: "PL", region: "europe", labelKey: "phoneCountryPL" },
  { dialCode: "+380", iso: "UA", region: "europe", labelKey: "phoneCountryUA" },
  { dialCode: "+351", iso: "PT", region: "europe", labelKey: "phoneCountryPT" },
  { dialCode: "+353", iso: "IE", region: "europe", labelKey: "phoneCountryIE" },
  { dialCode: "+7", iso: "RU", region: "europe", labelKey: "phoneCountryRU" },
  { dialCode: "+994", iso: "AZ", region: "asia", labelKey: "phoneCountryAZ" },
  { dialCode: "+7", iso: "KZ", region: "asia", labelKey: "phoneCountryKZ" },
  { dialCode: "+86", iso: "CN", region: "asia", labelKey: "phoneCountryCN" },
  { dialCode: "+81", iso: "JP", region: "asia", labelKey: "phoneCountryJP" },
  { dialCode: "+82", iso: "KR", region: "asia", labelKey: "phoneCountryKR" },
  { dialCode: "+91", iso: "IN", region: "asia", labelKey: "phoneCountryIN" },
  { dialCode: "+966", iso: "SA", region: "asia", labelKey: "phoneCountrySA" },
  { dialCode: "+971", iso: "AE", region: "asia", labelKey: "phoneCountryAE" },
  { dialCode: "+974", iso: "QA", region: "asia", labelKey: "phoneCountryQA" },
  { dialCode: "+965", iso: "KW", region: "asia", labelKey: "phoneCountryKW" },
  { dialCode: "+98", iso: "IR", region: "asia", labelKey: "phoneCountryIR" },
  { dialCode: "+964", iso: "IQ", region: "asia", labelKey: "phoneCountryIQ" },
  { dialCode: "+92", iso: "PK", region: "asia", labelKey: "phoneCountryPK" },
  { dialCode: "+62", iso: "ID", region: "asia", labelKey: "phoneCountryID" },
  { dialCode: "+60", iso: "MY", region: "asia", labelKey: "phoneCountryMY" },
  { dialCode: "+65", iso: "SG", region: "asia", labelKey: "phoneCountrySG" },
  { dialCode: "+66", iso: "TH", region: "asia", labelKey: "phoneCountryTH" },
  { dialCode: "+1", iso: "US", region: "americas", labelKey: "phoneCountryUS" },
  { dialCode: "+1", iso: "CA", region: "americas", labelKey: "phoneCountryCA" },
  {
    dialCode: "+55",
    iso: "BR",
    region: "americas",
    labelKey: "phoneCountryBR",
  },
  {
    dialCode: "+54",
    iso: "AR",
    region: "americas",
    labelKey: "phoneCountryAR",
  },
  {
    dialCode: "+52",
    iso: "MX",
    region: "americas",
    labelKey: "phoneCountryMX",
  },
  {
    dialCode: "+57",
    iso: "CO",
    region: "americas",
    labelKey: "phoneCountryCO",
  },
  {
    dialCode: "+56",
    iso: "CL",
    region: "americas",
    labelKey: "phoneCountryCL",
  },
  { dialCode: "+20", iso: "EG", region: "africa", labelKey: "phoneCountryEG" },
  { dialCode: "+27", iso: "ZA", region: "africa", labelKey: "phoneCountryZA" },
  { dialCode: "+212", iso: "MA", region: "africa", labelKey: "phoneCountryMA" },
  { dialCode: "+61", iso: "AU", region: "oceania", labelKey: "phoneCountryAU" },
  { dialCode: "+64", iso: "NZ", region: "oceania", labelKey: "phoneCountryNZ" },
] as const;

const DIAL_CODE_MATCH_ORDER = [...PHONE_COUNTRY_CODES].sort(
  (a, b) => b.dialCode.length - a.dialCode.length,
);

export function getPhoneCountryByIso(
  iso: string,
): PhoneCountryCode | undefined {
  return PHONE_COUNTRY_CODES.find((country) => country.iso === iso);
}

export function getPhoneCountryByDialCode(
  dialCode: string,
): PhoneCountryCode | undefined {
  return PHONE_COUNTRY_CODES.find((country) => country.dialCode === dialCode);
}

export function splitPhoneNumber(phone: string | null | undefined): {
  iso: string;
  dialCode: string;
  nationalNumber: string;
} {
  const trimmed = phone?.trim() ?? "";
  if (!trimmed) {
    return {
      iso: DEFAULT_PHONE_COUNTRY_ISO,
      dialCode: DEFAULT_PHONE_DIAL_CODE,
      nationalNumber: "",
    };
  }

  const normalized = trimmed.replace(/\s+/g, " ");
  const matched = DIAL_CODE_MATCH_ORDER.find((country) =>
    normalized.startsWith(country.dialCode),
  );

  if (matched) {
    return {
      iso: matched.iso,
      dialCode: matched.dialCode,
      nationalNumber: normalized.slice(matched.dialCode.length).trim(),
    };
  }

  if (normalized.startsWith("+")) {
    const spaceIndex = normalized.indexOf(" ");
    if (spaceIndex > 1) {
      const dialCode = normalized.slice(0, spaceIndex);
      const known = getPhoneCountryByDialCode(dialCode);
      return {
        iso: known?.iso ?? DEFAULT_PHONE_COUNTRY_ISO,
        dialCode,
        nationalNumber: normalized.slice(spaceIndex + 1).trim(),
      };
    }
  }

  return {
    iso: DEFAULT_PHONE_COUNTRY_ISO,
    dialCode: DEFAULT_PHONE_DIAL_CODE,
    nationalNumber: normalized.replace(/^\+/, ""),
  };
}

export function joinPhoneNumber(
  dialCode: string,
  nationalNumber: string,
): string | null {
  const digits = nationalNumber.replace(/[^\d]/g, "");
  if (!digits) {
    return null;
  }

  return `${dialCode} ${digits}`;
}

export function isValidNationalNumber(nationalNumber: string): boolean {
  const digits = nationalNumber.replace(/[^\d]/g, "");
  return digits.length >= 6 && digits.length <= 15;
}

export const PHONE_REGION_ORDER: readonly PhoneCountryRegion[] = [
  "europe",
  "asia",
  "americas",
  "africa",
  "oceania",
];
