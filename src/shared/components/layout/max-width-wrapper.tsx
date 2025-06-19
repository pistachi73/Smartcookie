import { type ReactNode, forwardRef } from "react";

import { cn } from "@/shared/lib/classes";

export const MaxWidthWrapper = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    as?: string;
  }
>(({ className, children, as = "div" }, ref) => {
  const Component = as as any;
  return (
    <Component
      ref={ref}
      className={cn("max-w-7xl mx-auto w-full px-2.5 md:px-20", className)}
    >
      {children}
    </Component>
  );
});

MaxWidthWrapper.displayName = "MaxWidthWrapper";
