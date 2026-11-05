"use client";

import { Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { speakText } from "@/lib/speakText";

type LessonSpeakButtonProps = {
  text: string;
};

function toSpokenText(text: string): string {
  return text.replace(/\s*\/\s*/g, ", ");
}

export function LessonSpeakButton({ text }: LessonSpeakButtonProps) {
  const t = useTranslations("Topic");

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      className="text-brand-500 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-100"
      aria-label={t("speakItem", { text })}
      onClick={() => speakText(toSpokenText(text))}
    >
      <Volume2 aria-hidden />
    </Button>
  );
}
