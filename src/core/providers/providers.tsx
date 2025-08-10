"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LazyMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { I18nProvider, RouterProvider } from "react-aria-components";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { OptimizedCalendarProvider } from "@/features/calendar/providers/optimized-calendar-provider";

const loadFeatures = () =>
  import("./animationFeatures.js").then((res) => res.default);

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider navigate={router.push}>
        <I18nProvider locale={"en-GB"}>
          <ThemeProvider
            attribute="class"
            disableTransitionOnChange
            defaultTheme="light"
          >
            <LazyMotion features={loadFeatures}>
              <OptimizedCalendarProvider>{children}</OptimizedCalendarProvider>
            </LazyMotion>
          </ThemeProvider>
        </I18nProvider>
      </RouterProvider>
      <ReactQueryDevtools initialIsOpen={true} position="right" />
    </QueryClientProvider>
  );
};
