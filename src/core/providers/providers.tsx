"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LazyMotion } from "motion/react";
import { RouterProvider } from "react-aria-components";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { useRouter } from "@/i18n/navigation";
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

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider navigate={router.push}>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          defaultTheme="light"
        >
          <LazyMotion features={loadFeatures}>{children}</LazyMotion>
        </ThemeProvider>
      </RouterProvider>

      <ReactQueryDevtools initialIsOpen={true} position="left" />
    </QueryClientProvider>
  );
};
