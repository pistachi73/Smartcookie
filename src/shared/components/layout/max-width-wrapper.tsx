import { type ReactNode, forwardRef } from "react";

import { cn } from "@/shared/lib/classes";

export const MaxWidthWrapper = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    as?: string;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, as = "div", ...props }, ref) => {
  const Component = as as any;
  return (
    <Component
      ref={ref}
      className={cn("max-w-7xl mx-auto w-full px-[2%] md:px-[5%]", className)}
      {...props}
    >
      {children}
    </Component>
  );
});

MaxWidthWrapper.displayName = "MaxWidthWrapper";
