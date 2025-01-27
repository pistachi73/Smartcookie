"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion } from "motion/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { I18nProvider, RouterProvider } from "react-aria-components";

const loadFeatures = () =>
  import("./animationFeatures.js").then((res) => res.default);

const queryClient = new QueryClient();

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider navigate={router.push}>
        <I18nProvider locale={"en-GB"}>
          <ThemeProvider
            attribute="class"
            disableTransitionOnChange
            defaultTheme="system"
          >
            <LazyMotion features={loadFeatures}>{children}</LazyMotion>
          </ThemeProvider>
        </I18nProvider>
      </RouterProvider>
    </QueryClientProvider>
  );
};
