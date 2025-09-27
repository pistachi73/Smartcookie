import "@/styles/globals.css";
import "@/styles/scrollbar.css";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { LocalizedStringProvider } from "react-aria-components/i18n";

import { Toast } from "@/ui/toast";
import { ToastNotification } from "@/shared/components/layout/toast-notification";
import { getSsrViewport } from "@/shared/components/layout/viewport-context/utils";
import { ViewportProvider } from "@/shared/components/layout/viewport-context/viewport-context";
import { getHeaders } from "@/shared/lib/get-headers";

import { auth } from "@/core/config/auth-config";
import { Providers } from "@/core/providers/providers";
import { routing } from "@/i18n/routing";
import { sans } from "./fonts";

// app/layout.tsx

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();

  const t = await getTranslations({
    namespace: "Metadata.Landing",
    locale,
  });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
    },
    authors: [{ name: "Martina Monreal" }, { name: "Óscar Pulido" }],
    creator: "SmartCookie",
    publisher: "SmartCookie",
    metadataBase: new URL("https://smartcookieapp.com"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    keywords: [
      "language teacher app",
      "teaching organization",
      "lesson tracking",
      "student motivation",
      "second brain for teachers",
    ],
  };
};

export default async function RootLayout({
  children,
  auth: authModal,
  params,
}: LayoutProps<"/[locale]">) {
  const [{ locale }, messages, session, { deviceType }] = await Promise.all([
    params,
    getMessages(),
    auth(),
    getHeaders(),
  ]);

  const ssrViewport = getSsrViewport(deviceType);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={"ltr"} className="h-full" suppressHydrationWarning>
      <body className={`${sans.variable} font-sans h-full`}>
        <LocalizedStringProvider locale={locale} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <SessionProvider session={session}>
              <ViewportProvider ssrViewport={ssrViewport}>
                {children}
                {authModal}
                <Toast />
                <ToastNotification />
              </ViewportProvider>
            </SessionProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
