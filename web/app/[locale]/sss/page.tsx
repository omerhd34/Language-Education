import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqList } from "@/components/features/faq/FaqList";
import { Container } from "@/components/ui/Container";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages.sss");

  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-4">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-900 sm:text-4xl dark:text-brand-100">
            {t("title")}
          </h1>
          <p className="text-base leading-relaxed text-brand-600 dark:text-brand-400">
            {t("description")}
          </p>
        </div>
        <FaqList />
      </div>
    </Container>
  );
}
