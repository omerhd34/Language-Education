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
  { href: "/panel", labelKey: "home", Icon: Home },
  { href: "/panel#genel", labelKey: "overview", Icon: ClipboardList },
  {
    href: "/panel#dilbilgisi",
    labelKey: "topics",
    Icon: Layers,
  },
  {
    href: "/panel#kelimeler",
    labelKey: "vocabulary",
    Icon: Brain,
  },
  {
    href: "/panel#dinleme",
    labelKey: "listening",
    Icon: Headphones,
  },
  {
    href: "/panel#yazma",
    labelKey: "writing",
    Icon: PenLine,
  },
  {
    href: "/panel#konusma",
    labelKey: "speaking",
    Icon: Mic,
  },
  {
    href: "/panel#okuma",
    labelKey: "reading",
    Icon: BookOpen,
  },
  {
    href: "/panel#ilerleme",
    labelKey: "progress",
    Icon: ChartColumnIncreasing,
  },
  { href: "/hakkimizda", labelKey: "info", Icon: Info },
];
