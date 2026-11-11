"use client";

import { useTranslations } from "next-intl";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { speakText } from "@/lib/speakText";

type ExerciseListenWordButtonProps = {
  text: string;
};

export function ExerciseListenWordButton({
  text,
}: ExerciseListenWordButtonProps) {
  const t = useTranslations("Exercises");
  const spoken = text.trim();
  if (!spoken) {
    return null;
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="border-brand-400/50 text-brand-800 dark:border-brand-500/40 dark:text-brand-200"
      aria-label={t("listenWord", { word: spoken })}
      onClick={(event) => {
        event.stopPropagation();
        speakText(spoken, "en-US");
      }}
    >
      <Volume2 className="size-4" aria-hidden />
      {t("listen")}
    </Button>
  );
}
