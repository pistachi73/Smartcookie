"use client";

import { getQueryClient } from "@/utils/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LazyMotion } from "motion/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { I18nProvider, RouterProvider } from "react-aria-components";

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
            defaultTheme="system"
          >
            <LazyMotion features={loadFeatures}>{children}</LazyMotion>
          </ThemeProvider>
        </I18nProvider>
      </RouterProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
