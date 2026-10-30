import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/components/features/auth/RegisterForm";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Auth");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:px-6">
      <Card>
        <div className="mb-6 space-y-2">
          <h1 className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {t("registerTitle")}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t("registerSubtitle")}
          </p>
        </div>
        <RegisterForm />
      </Card>
    </div>
  );
}
