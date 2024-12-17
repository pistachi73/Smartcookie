"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion } from "motion/react";
import { ThemeProvider } from "next-themes";
import { I18nProvider } from "react-aria-components";

const loadFeatures = () =>
  import("./animationFeatures.js").then((res) => res.default);

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider locale={"en-GB"}>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          defaultTheme="system"
        >
          <LazyMotion features={loadFeatures}>
            <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          </LazyMotion>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
};
