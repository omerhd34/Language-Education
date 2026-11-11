"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SettingsSection } from "@/components/features/settings/SettingsSection";
import { clearClientProgressForScope } from "@/lib/progressResetClient";
import { useVocabularyStore } from "@/store/vocabularyStore";
import type { ProgressResetScope } from "@/types/api";

const SCOPES: ProgressResetScope[] = [
  "grammar",
  "vocabulary",
  "reading",
  "listening",
  "writing",
  "speaking",
  "all",
];

export function ProgressResetPanel() {
  const t = useTranslations("Settings");
  const resetProgress = useVocabularyStore((state) => state.resetProgress);
  const isLoading = useVocabularyStore((state) => state.isResettingProgress);
  const [pendingScope, setPendingScope] = useState<ProgressResetScope | null>(
    null,
  );
  const [error, setError] = useState(false);
  const [doneScope, setDoneScope] = useState<ProgressResetScope | null>(null);

  async function handleConfirm() {
    if (!pendingScope) {
      return;
    }

    setError(false);
    try {
      await resetProgress({ scope: pendingScope });
      clearClientProgressForScope(pendingScope);
      setDoneScope(pendingScope);
      setPendingScope(null);
    } catch {
      setError(true);
    }
  }

  return (
    <SettingsSection
      titleId="settings-progress-reset"
      title={t("progressResetTitle")}
      description={t("progressResetSubtitle")}
      icon={<RotateCcw className="size-5" aria-hidden />}
    >
      <ul className="grid grid-cols-2 gap-2">
        {SCOPES.map((scope) => (
          <li
            key={scope}
            className={scope === "all" ? "col-span-2" : undefined}
          >
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setDoneScope(null);
                setError(false);
                setPendingScope(scope);
              }}
              className="flex h-full w-full cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-background/80 px-3 py-2.5 text-left transition-colors hover:border-sky-500/45 hover:bg-sky-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-950/40"
            >
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                <RotateCcw className="size-3.5" aria-hidden />
              </span>
              <span className="min-w-0 truncate text-sm font-medium text-brand-950 dark:text-brand-100">
                {t(`progressResetScope.${scope}.title`)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {pendingScope ? (
        <div
          role="alertdialog"
          aria-labelledby="progress-reset-confirm-title"
          aria-describedby="progress-reset-confirm-body"
          className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-4"
        >
          <p
            id="progress-reset-confirm-title"
            className="text-sm font-medium text-amber-950 dark:text-amber-100"
          >
            {t("progressResetConfirmTitle")}
          </p>
          <p
            id="progress-reset-confirm-body"
            className="mt-1 text-xs text-amber-900/90 dark:text-amber-200/90"
          >
            {t(`progressResetScope.${pendingScope}.confirm`)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isLoading}
              onClick={() => setPendingScope(null)}
            >
              {t("progressResetCancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isLoading}
              onClick={() => {
                void handleConfirm();
              }}
            >
              {t("progressResetConfirm")}
            </Button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {t("progressResetError")}
        </p>
      ) : null}

      {doneScope ? (
        <p
          className="text-sm text-emerald-700 dark:text-emerald-300"
          role="status"
        >
          {t(`progressResetScope.${doneScope}.success`)}
        </p>
      ) : null}
    </SettingsSection>
  );
}
