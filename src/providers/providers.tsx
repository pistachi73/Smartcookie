"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { LazyMotion, domAnimation } from "framer-motion";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme="system"
    >
      <LazyMotion features={domAnimation} strict>
        <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
      </LazyMotion>
    </ThemeProvider>
  );
};
