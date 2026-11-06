import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BookOpen,
  Brain,
  ChartColumnIncreasing,
  ClipboardList,
  Headphones,
  Home,
  Info,
  Layers,
  Library,
  Mic,
  PenLine,
  Timer,
} from "lucide-react";

export type AppNavLabelKey =
  | "home"
  | "overview"
  | "topics"
  | "vocabulary"
  | "vocabularyWords"
  | "vocabularyStudiedToday"
  | "vocabularyKnown"
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

export const vocabularySubNav = [
  {
    href: "/panel#kelimeler",
    labelKey: "vocabularyWords",
    Icon: Library,
  },
  {
    href: "/panel/kelime/bugun-calisilan",
    labelKey: "vocabularyStudiedToday",
    Icon: Timer,
  },
  {
    href: "/panel/kelime/bilinen",
    labelKey: "vocabularyKnown",
    Icon: BadgeCheck,
  },
] as const satisfies readonly {
  href: string;
  labelKey: AppNavLabelKey;
  Icon: LucideIcon;
}[];

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
