export const instant = false;
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { VocabularyCategoryHeader } from "@/components/features/vocabulary/VocabularyCategoryHeader";
import { VocabularyCategoryView } from "@/components/features/vocabulary/VocabularyCategoryView";
import {
  getVocabularyCategoryById,
  vocabularyCategories,
} from "@/data/vocabulary";
import { getVocabularyCategoryDisplayIndex } from "@/lib/vocabularyAccess";

type PageProps = {
  params: Promise<{ locale: string; categoryId: string }>;
};

export function generateStaticParams() {
  return vocabularyCategories.map((category) => ({
    categoryId: category.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, categoryId } = await params;
  const t = await getTranslations({ locale, namespace: "Vocabulary" });
  const category = getVocabularyCategoryById(categoryId);

  return {
    title: category
      ? t("documentTitle", { title: category.title })
      : t("title"),
  };
}

export default async function VocabularyCategoryPage({ params }: PageProps) {
  const { locale, categoryId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Vocabulary");

  const category = getVocabularyCategoryById(categoryId);
  if (!category) {
    notFound();
  }

  const index = getVocabularyCategoryDisplayIndex(categoryId);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <VocabularyCategoryHeader
        title={category.title}
        titleEn={category.titleEn}
        index={index}
        wordCount={category.words.length}
      />
      <Suspense
        fallback={
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("statusLoading")}
          </p>
        }
      >
        <VocabularyCategoryView
          categoryId={category.id}
          words={category.words}
        />
      </Suspense>
    </div>
  );
}
