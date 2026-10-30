import { setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/components/features/auth/RegisterForm";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:px-6">
      <Card>
        <RegisterForm />
      </Card>
    </div>
  );
}
