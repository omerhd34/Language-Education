export const instant = false;

import { getTranslations, setRequestLocale } from "next-intl/server";
import { VocabularyQuizView } from "@/components/features/vocabulary/VocabularyQuizView";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Vocabulary" });

  return {
    title: t("quizDocumentTitle"),
  };
}

export default async function VocabularyQuizPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Vocabulary");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-950 sm:text-3xl dark:text-brand-100">
          {t("quizTitle")}
        </h1>
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("quizSubtitle")}
        </p>
      </div>
      <VocabularyQuizView />
    </div>
  );
}
