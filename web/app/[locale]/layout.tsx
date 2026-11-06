import { cookies } from "next/headers";
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
import {
  isSidebarOpenFromCookie,
  SIDEBAR_COOKIE_NAME,
} from "@/lib/sidebarPreference";
import { parseSessionHint, SESSION_HINT_COOKIE } from "@/lib/sessionHint";
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
  const cookieStore = await cookies();
  const initialUser = parseSessionHint(
    cookieStore.get(SESSION_HINT_COOKIE)?.value,
  );
  const sidebarOpen = isSidebarOpenFromCookie(
    cookieStore.get(SIDEBAR_COOKIE_NAME)?.value,
  );

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
              <SiteChrome initialUser={initialUser} sidebarOpen={sidebarOpen}>
                {children}
              </SiteChrome>
            </AppProviders>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
