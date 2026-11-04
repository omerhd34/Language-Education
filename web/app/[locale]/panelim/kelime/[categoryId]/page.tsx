export const instant = false;
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
  searchParams: Promise<{ tab?: string }>;
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

export default async function VocabularyCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { locale, categoryId } = await params;
  const { tab } = await searchParams;
  setRequestLocale(locale);

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
      <VocabularyCategoryView
        categoryId={category.id}
        words={category.words}
        initialTab={tab === "exercises" ? "exercises" : "words"}
      />
    </div>
  );
}
