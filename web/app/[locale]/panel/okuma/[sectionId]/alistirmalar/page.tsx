export const instant = false;

import { redirect } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string; sectionId: string }>;
};

export default async function ReadingPracticeRedirectPage({ params }: PageProps) {
  const { locale, sectionId } = await params;
  redirect({
    href: `/panel/okuma/${sectionId}#reading-alistirma`,
    locale,
  });
}
