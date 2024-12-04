import "@/styles/globals.css";

import { auth } from "@/auth-config";
import { DeviceOnlyProvider } from "@/components/device-only/device-only-provider";
import { ToastNotification } from "@/components/toast-notification";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/providers/providers";
import { getHeaders } from "@/utils/get-headers";
import { SessionProvider } from "next-auth/react";
import { inter } from "./fonts";

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
    <html lang={"en-GB"} dir={"ltr"} suppressHydrationWarning>
      <body
        className={`font-sans ${inter.variable} min-h-screen bg-background`}
      >
        <Providers>
          <SessionProvider session={session}>
            <DeviceOnlyProvider deviceType={deviceType}>
              {children}
              {authModal}
              <Toaster />
              <ToastNotification />
            </DeviceOnlyProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
