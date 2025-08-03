import "@/styles/globals.css";
import "@/styles/scrollbar.css";

import { SessionProvider } from "next-auth/react";

import { Toast } from "@/ui/toast";
import { ToastNotification } from "@/shared/components/layout/toast-notification";
import { getSsrViewport } from "@/shared/components/layout/viewport-context/utils";
import { ViewportProvider } from "@/shared/components/layout/viewport-context/viewport-context";
import { getHeaders } from "@/shared/lib/get-headers";

import { auth } from "@/core/config/auth-config";
import { Providers } from "@/core/providers/providers";
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
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
}) {
  const session = await auth();
  const { deviceType } = await getHeaders();
  const ssrViewport = getSsrViewport(deviceType);
  return (
    <html
      lang={"en-GB"}
      dir={"ltr"}
      className="h-full"
      suppressHydrationWarning
    >
      {/* <ReactScan /> */}
      <body className={`${sans.variable} font-sans h-full`}>
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
      </body>
    </html>
  );
}
