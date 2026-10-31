export function getUserInitials(
  name: string | null | undefined,
  email: string,
): string {
  const trimmedName = name?.trim();

  if (trimmedName) {
    const parts = trimmedName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const first = parts[0]?.[0] ?? "";
      const second = parts[1]?.[0] ?? "";
      return `${first}${second}`.toUpperCase();
    }
    return trimmedName.slice(0, 2).toUpperCase();
  }

  const localPart = email.split("@")[0] ?? email;
  return localPart.slice(0, 2).toUpperCase();
}
