"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { LazyMotion } from "motion/react";
import { ThemeProvider } from "next-themes";

const loadFeatures = () =>
  import("./animationFeatures.js").then((res) => res.default);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme="system"
    >
      <LazyMotion features={loadFeatures}>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </LazyMotion>
    </ThemeProvider>
  );
};
