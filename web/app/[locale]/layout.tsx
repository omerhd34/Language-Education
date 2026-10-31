import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Manrope, Source_Serif_4 } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { AppProviders } from "@/components/providers/AppProviders";
import { routing } from "@/i18n/routing";
import "../globals.css";

const bodyFont = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

const displayFont = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <Suspense fallback={null}>
            <AppProviders>
              <SiteChrome>{children}</SiteChrome>
            </AppProviders>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
