import "@/styles/globals.css";
import "@/styles/scrollbar.css";

import { auth } from "@/auth-config";
import { DeviceOnlyProvider } from "@/components/device-only/device-only-provider";
import { ReactScan } from "@/components/react-scan";
import { ToastNotification } from "@/components/toast-notification";
import { Toast } from "@/components/ui";
import { Providers } from "@/providers/providers";
import { getHeaders } from "@/utils/get-headers";
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
      <ReactScan />
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
