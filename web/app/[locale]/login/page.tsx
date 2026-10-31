import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/features/auth/LoginForm";

export default async function LoginPage({
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
          <h1 className="font-display text-2xl font-semibold text-brand-950 dark:text-brand-100">
            {t("loginTitle")}
          </h1>
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("loginSubtitle")}
          </p>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
}
