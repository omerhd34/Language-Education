export const navLinks = [
  { href: "/hakkimizda", labelKey: "about" },
  { href: "/kazanimlar", labelKey: "benefits" },
  { href: "/paketler", labelKey: "packages" },
  { href: "/sss", labelKey: "sss" },
  { href: "/iletisim", labelKey: "contact" },
] as const;

export type NavLinkLabelKey = (typeof navLinks)[number]["labelKey"];
