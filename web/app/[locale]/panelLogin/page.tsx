import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthPanel } from "@/components/features/auth/AuthPanel";
import { AuthPanelShell } from "@/components/features/auth/AuthPanelShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  return {
    title: t("myPanel"),
  };
}

export default async function PanelLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AuthPanelShell>
      <AuthPanel />
    </AuthPanelShell>
  );
}
