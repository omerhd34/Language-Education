"use client";

import { Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { speakText } from "@/lib/speakText";
import { cn } from "@/lib/utils";

type VerbFormSpeakButtonProps = {
  form: string;
  className?: string;
};

function toSpokenForm(form: string): string {
  const primary = form.split("/")[0]?.trim() ?? form;
  return primary.replace(/\s+/g, " ").trim();
}

export function VerbFormSpeakButton({
  form,
  className,
}: VerbFormSpeakButtonProps) {
  const t = useTranslations("Vocabulary");
  const spoken = toSpokenForm(form);

  return (
    <button
      type="button"
      onClick={() => speakText(spoken, "en-US")}
      className={cn(
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg",
        "bg-sky-500/10 text-sky-700 transition-colors hover:bg-sky-500/20",
        "dark:bg-sky-400/15 dark:text-sky-200 dark:hover:bg-sky-400/25",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40",
        className,
      )}
      aria-label={t("verbsSpeakForm", { form: spoken })}
    >
      <Volume2 className="size-4" aria-hidden />
    </button>
  );
}
