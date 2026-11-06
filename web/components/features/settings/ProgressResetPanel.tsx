"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { useResetProgressMutation, type ProgressResetScope } from "@/store/api";
import { Button } from "@/components/ui/Button";
import { clearExerciseDraftStorage } from "@/lib/exerciseDraftStorage";
import { clearLevelExamProgress } from "@/lib/levelExamProgressStorage";
import { clearPassedLevelExams } from "@/lib/levelExamStorage";
import { clearTopicExamDrafts } from "@/lib/topicExamDraftStorage";
import { clearTopicProgressStorage } from "@/lib/topicProgressStorage";
import { clearVocabularyActivityStorage } from "@/lib/vocabularyActivityStorage";
import { clearLastVocabularyQuizResult } from "@/lib/vocabularyQuizResultStorage";

const SCOPES: ProgressResetScope[] = ["vocabulary", "topics", "all"];

export function ProgressResetPanel() {
  const t = useTranslations("Settings");
  const [resetProgress, { isLoading }] = useResetProgressMutation();
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
      await resetProgress({ scope: pendingScope }).unwrap();
      if (pendingScope === "vocabulary" || pendingScope === "all") {
        clearLastVocabularyQuizResult();
        clearVocabularyActivityStorage();
      }
      if (pendingScope === "topics" || pendingScope === "all") {
        clearPassedLevelExams();
        clearLevelExamProgress();
        clearTopicProgressStorage();
        clearExerciseDraftStorage();
        clearTopicExamDrafts();
      }
      setDoneScope(pendingScope);
      setPendingScope(null);
    } catch {
      setError(true);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-brand-950 dark:text-brand-100">
          {t("progressResetTitle")}
        </h2>
        <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
          {t("progressResetSubtitle")}
        </p>
      </div>

      <article className="space-y-3 rounded-2xl border border-brand-200/80 bg-brand-50/40 px-4 py-4 dark:border-brand-800/70 dark:bg-brand-950/30">
        <ul className="space-y-2">
          {SCOPES.map((scope) => (
            <li key={scope}>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setDoneScope(null);
                  setError(false);
                  setPendingScope(scope);
                }}
                className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-border bg-background/70 px-3 py-3 text-left transition-colors hover:border-sky-500/50 hover:bg-sky-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RotateCcw
                  className="mt-0.5 size-4 shrink-0 text-brand-500"
                  aria-hidden
                />
                <span className="min-w-0 space-y-0.5">
                  <span className="block text-sm font-medium text-brand-950 dark:text-brand-100">
                    {t(`progressResetScope.${scope}.title`)}
                  </span>
                  <span className="block text-xs text-brand-600 dark:text-brand-400">
                    {t(`progressResetScope.${scope}.description`)}
                  </span>
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
            className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-3"
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
      </article>
    </div>
  );
}
