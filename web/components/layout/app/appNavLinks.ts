import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Brain,
  ChartColumnIncreasing,
  ClipboardList,
  Home,
  Info,
  Layers,
} from "lucide-react";

export type AppNavLink = {
  href: string;
  labelKey:
    | "home"
    | "overview"
    | "topics"
    | "vocabulary"
    | "exercises"
    | "progress"
    | "info";
  Icon: LucideIcon;
};

export const appNavLinks: AppNavLink[] = [
  { href: "/panelim", labelKey: "home", Icon: Home },
  { href: "/panelim#genel", labelKey: "overview", Icon: ClipboardList },
  { href: "/panelim#konular", labelKey: "topics", Icon: Layers },
  { href: "/panelim#kelime", labelKey: "vocabulary", Icon: Brain },
  { href: "/panelim#alistirmalar", labelKey: "exercises", Icon: BookOpen },
  {
    href: "/panelim#ilerleme",
    labelKey: "progress",
    Icon: ChartColumnIncreasing,
  },
  { href: "/hakkimizda", labelKey: "info", Icon: Info },
];
