import type { IconType } from "react-icons";
import {
  HiCube,
  HiEnvelope,
  HiQuestionMarkCircle,
  HiTrophy,
} from "react-icons/hi2";

export const navLinks = [
  { href: "/kazanimlar", labelKey: "benefits", Icon: HiTrophy },
  { href: "/paketler", labelKey: "packages", Icon: HiCube },
  { href: "/sss", labelKey: "sss", Icon: HiQuestionMarkCircle },
  { href: "/iletisim", labelKey: "contact", Icon: HiEnvelope },
] as const satisfies ReadonlyArray<{
  href: string;
  labelKey: string;
  Icon: IconType;
}>;

export type NavLinkLabelKey = (typeof navLinks)[number]["labelKey"];
