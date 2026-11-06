import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Brain,
  ChartColumnIncreasing,
  ClipboardList,
  Headphones,
  Home,
  Info,
  Layers,
  Mic,
  PenLine,
} from "lucide-react";

export type AppNavLabelKey =
  | "home"
  | "overview"
  | "topics"
  | "vocabulary"
  | "listening"
  | "writing"
  | "speaking"
  | "reading"
  | "exercises"
  | "progress"
  | "info";

export type AppNavLink = {
  href: string;
  labelKey: AppNavLabelKey;
  Icon: LucideIcon;
};

export const appNavLinks: AppNavLink[] = [
  { href: "/panelim", labelKey: "home", Icon: Home },
  { href: "/panelim#genel", labelKey: "overview", Icon: ClipboardList },
  {
    href: "/panelim#konular",
    labelKey: "topics",
    Icon: Layers,
  },
  {
    href: "/panelim#kelime",
    labelKey: "vocabulary",
    Icon: Brain,
  },
  {
    href: "/panelim#listening",
    labelKey: "listening",
    Icon: Headphones,
  },
  {
    href: "/panelim#writing",
    labelKey: "writing",
    Icon: PenLine,
  },
  {
    href: "/panelim#speaking",
    labelKey: "speaking",
    Icon: Mic,
  },
  {
    href: "/panelim#reading",
    labelKey: "reading",
    Icon: BookOpen,
  },
  {
    href: "/panelim#ilerleme",
    labelKey: "progress",
    Icon: ChartColumnIncreasing,
  },
  { href: "/hakkimizda", labelKey: "info", Icon: Info },
];
