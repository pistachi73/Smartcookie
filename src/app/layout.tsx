import "@/styles/globals.css";
import "@/styles/scrollbar.css";

import { auth } from "@/core/config/auth-config";
import { Providers } from "@/core/providers/providers";
import { DeviceOnlyProvider } from "@/shared/components/layout/device-only/device-only-provider";
import { ToastNotification } from "@/shared/components/layout/toast-notification";
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
            <DeviceOnlyProvider deviceType={deviceType}>
              {children}
              {authModal}
              <Toast />
              {/* <Toaster /> */}
              <ToastNotification />
            </DeviceOnlyProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
