"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LazyMotion } from "motion/react";
import { I18nProvider, RouterProvider } from "react-aria-components";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { ThemeProvider } from "./theme-provider";

const loadFeatures = () =>
  import("./animationFeatures.js").then((res) => res.default);

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export const Providers = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) => {
  const router = useRouter();
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider navigate={router.push}>
        <I18nProvider locale={locale}>
          <ThemeProvider
            attribute="class"
            disableTransitionOnChange
            defaultTheme="light"
          >
            <LazyMotion features={loadFeatures}>{children}</LazyMotion>
          </ThemeProvider>
        </I18nProvider>
      </RouterProvider>
      <ReactQueryDevtools initialIsOpen={true} position="left" />
    </QueryClientProvider>
  );
};
