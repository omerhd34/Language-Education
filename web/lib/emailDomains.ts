export const EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "live.com",
  "msn.com",
  "proton.me",
  "yandex.com",
  "mynet.com",
  "windowslive.com",
  "mail.com",
] as const;

export type EmailDomainSuggestion = {
  localPart: string;
  domain: string;
  email: string;
};

export function getEmailDomainSuggestions(
  value: string,
): EmailDomainSuggestion[] {
  const atIndex = value.indexOf("@");
  if (atIndex < 0) {
    return [];
  }

  const localPart = value.slice(0, atIndex);
  if (!localPart) {
    return [];
  }

  const domainQuery = value.slice(atIndex + 1).toLowerCase();

  return EMAIL_DOMAINS.filter((domain) => domain.startsWith(domainQuery))
    .filter((domain) => domain !== domainQuery)
    .map((domain) => ({
      localPart,
      domain,
      email: `${localPart}@${domain}`,
    }));
}
