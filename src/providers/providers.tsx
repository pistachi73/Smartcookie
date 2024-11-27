"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme="system"
    >
      {/* <LazyMotion features={domAnimation} strict> */}
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      {/* </LazyMotion> */}
    </ThemeProvider>
  );
};
