import type { LucideIcon } from "lucide-react";
import {
  BookA,
  BookOpen,
  CalendarDays,
  ChartColumnIncreasing,
  CircleCheck,
  ClipboardList,
  ListOrdered,
  Headphones,
  Home,
  Library,
  Mic,
  PenLine,
  SpellCheck2,
} from "lucide-react";

export type AppNavTooltipKey = `${AppNavLabelKey}Tooltip`;

export function appNavTooltipKey(labelKey: AppNavLabelKey): AppNavTooltipKey {
  return `${labelKey}Tooltip`;
}

export type AppNavLabelKey =
  | "home"
  | "overview"
  | "topics"
  | "vocabulary"
  | "vocabularyWords"
  | "vocabularyStudiedToday"
  | "vocabularyKnown"
  | "vocabularyVerbs"
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
    href: "/panel#vocabulary",
    labelKey: "vocabularyWords",
    Icon: Library,
  },
  {
    href: "/panel/vocabulary/today-worked",
    labelKey: "vocabularyStudiedToday",
    Icon: CalendarDays,
  },
  {
    href: "/panel/vocabulary/known-words",
    labelKey: "vocabularyKnown",
    Icon: CircleCheck,
  },
  {
    href: "/panel/vocabulary/verbs",
    labelKey: "vocabularyVerbs",
    Icon: ListOrdered,
  },
] as const satisfies readonly {
  href: string;
  labelKey: AppNavLabelKey;
  Icon: LucideIcon;
}[];

export const appNavLinks: AppNavLink[] = [
  { href: "/panel", labelKey: "home", Icon: Home },
  { href: "/panel#general", labelKey: "overview", Icon: ClipboardList },
  {
    href: "/panel#grammer",
    labelKey: "topics",
    Icon: SpellCheck2,
  },
  {
    href: "/panel#vocabulary",
    labelKey: "vocabulary",
    Icon: BookA,
  },
  {
    href: "/panel#reading",
    labelKey: "reading",
    Icon: BookOpen,
  },
  {
    href: "/panel#listening",
    labelKey: "listening",
    Icon: Headphones,
  },
  {
    href: "/panel#writing",
    labelKey: "writing",
    Icon: PenLine,
  },
  {
    href: "/panel#speaking",
    labelKey: "speaking",
    Icon: Mic,
  },

  {
    href: "/panel#progress",
    labelKey: "progress",
    Icon: ChartColumnIncreasing,
  },
];
