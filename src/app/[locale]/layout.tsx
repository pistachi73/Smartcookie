import "@/styles/globals.css";
import "@/styles/scrollbar.css";

import { notFound } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
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
export const metadata = {
  title: "SmartCookie – A Second Brain for Teachers",
  description:
    "SmartCookie is the all-in-one app that acts as a second brain for language teachers, helping them organize their calendars, track lesson progress, and boost student motivation through actionable feedback.",
  keywords: [
    "language teacher app",
    "teaching organization",
    "lesson tracking",
    "student motivation",
    "second brain for teachers",
  ],
  authors: [{ name: "SmartCookie Team" }],
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
  manifest: "/site.webmanifest",
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
      {/* <ReactScan /> */}
      <body className={`${sans.variable} font-sans h-full`}>
        <LocalizedStringProvider locale={locale} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers locale={locale}>
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
