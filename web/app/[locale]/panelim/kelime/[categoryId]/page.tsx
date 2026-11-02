import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { VocabularyCategoryHeader } from "@/components/features/vocabulary/VocabularyCategoryHeader";
import { VocabularyWordList } from "@/components/features/vocabulary/VocabularyWordList";
import {
  getVocabularyCategoryById,
  vocabularyCategories,
} from "@/data/vocabulary";

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

  const category = getVocabularyCategoryById(categoryId);
  if (!category) {
    notFound();
  }

  const index =
    vocabularyCategories.findIndex((item) => item.id === categoryId) + 1;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <VocabularyCategoryHeader
        title={category.title}
        index={index}
        wordCount={category.words.length}
      />
      <VocabularyWordList words={category.words} />
    </div>
  );
}
