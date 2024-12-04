"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { LazyMotion } from "motion/react";
import { ThemeProvider } from "next-themes";
import { I18nProvider } from "react-aria-components";

const loadFeatures = () =>
  import("./animationFeatures.js").then((res) => res.default);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
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
  );
};
