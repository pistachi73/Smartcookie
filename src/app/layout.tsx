import "@/styles/globals.css";
import "@/styles/scrollbar.css";

import { auth } from "@/core/config/auth-config";
import { Providers } from "@/core/providers/providers";
import { ToastNotification } from "@/shared/components/layout/toast-notification";
import { getSsrViewport } from "@/shared/components/layout/viewport-context/utils";
import { ViewportProvider } from "@/shared/components/layout/viewport-context/viewport-context";
import { getHeaders } from "@/shared/lib/get-headers";
import { Toast } from "@/ui/toast";
import { SessionProvider } from "next-auth/react";
import { sans } from "./fonts";

export const metadata = {
  title: "Title",
  description: "Description",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
              {/* <Toaster /> */}
              <ToastNotification />
            </ViewportProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
