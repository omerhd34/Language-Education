"use client";

import { Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { speakText } from "@/lib/speakText";
import { cn } from "@/lib/utils";

type LessonSpeakButtonProps = {
  text: string;
  lang?: string;
  className?: string;
  size?: "icon-xs" | "icon-sm";
};

function toSpokenText(text: string): string {
  return text.replace(/\s*\/\s*/g, ", ");
}

export function LessonSpeakButton({
  text,
  lang = "en-US",
  className,
  size = "icon-xs",
}: LessonSpeakButtonProps) {
  const t = useTranslations("Topic");

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      className={cn(
        "text-brand-500 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-100",
        className,
      )}
      aria-label={t("speakItem", { text })}
      onClick={() => speakText(toSpokenText(text), lang)}
    >
      <Volume2 aria-hidden />
    </Button>
  );
}
