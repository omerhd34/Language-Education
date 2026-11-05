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

export type AppNavTooltipKey =
  | "topicsTr"
  | "vocabularyTr"
  | "listeningTr"
  | "writingTr"
  | "speakingTr"
  | "readingTr";

export type AppNavLink = {
  href: string;
  labelKey: AppNavLabelKey;
  tooltipKey?: AppNavTooltipKey;
  Icon: LucideIcon;
};

export const appNavLinks: AppNavLink[] = [
  { href: "/panelim", labelKey: "home", Icon: Home },
  { href: "/panelim#genel", labelKey: "overview", Icon: ClipboardList },
  {
    href: "/panelim#konular",
    labelKey: "topics",
    tooltipKey: "topicsTr",
    Icon: Layers,
  },
  {
    href: "/panelim#kelime",
    labelKey: "vocabulary",
    tooltipKey: "vocabularyTr",
    Icon: Brain,
  },
  {
    href: "/panelim#listening",
    labelKey: "listening",
    tooltipKey: "listeningTr",
    Icon: Headphones,
  },
  {
    href: "/panelim#writing",
    labelKey: "writing",
    tooltipKey: "writingTr",
    Icon: PenLine,
  },
  {
    href: "/panelim#speaking",
    labelKey: "speaking",
    tooltipKey: "speakingTr",
    Icon: Mic,
  },
  {
    href: "/panelim#reading",
    labelKey: "reading",
    tooltipKey: "readingTr",
    Icon: BookOpen,
  },
  {
    href: "/panelim#ilerleme",
    labelKey: "progress",
    Icon: ChartColumnIncreasing,
  },
  { href: "/hakkimizda", labelKey: "info", Icon: Info },
];
