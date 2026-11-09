import type { LucideIcon } from "lucide-react";
import {
  BookA,
  BookOpen,
  CalendarDays,
  ChartColumnIncreasing,
  CircleCheck,
  ClipboardList,
  Headphones,
  Home,
  Library,
  Mic,
  PenLine,
  SpellCheck2,
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
  | "progress";

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
    Icon: CalendarDays,
  },
  {
    href: "/panel/kelime/bilinen",
    labelKey: "vocabularyKnown",
    Icon: CircleCheck,
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
    Icon: SpellCheck2,
  },
  {
    href: "/panel#kelimeler",
    labelKey: "vocabulary",
    Icon: BookA,
  },
  {
    href: "/panel#okuma",
    labelKey: "reading",
    Icon: BookOpen,
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
    href: "/panel#ilerleme",
    labelKey: "progress",
    Icon: ChartColumnIncreasing,
  },
];
