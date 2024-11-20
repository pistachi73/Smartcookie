import * as React from "react";

import { cn } from "@/lib/utils";
import { Search01Icon } from "@hugeicons/react";
import { type VariantProps, cva } from "class-variance-authority";
import { inputVariants } from "./input";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

const inputIconSizeMap: Record<
  NonNullable<VariantProps<typeof inputVariants>["size"]>,
  number
> = {
  lg: 24,
  default: 20,
  sm: 18,
};

const searchInputVariants = cva("", {
  variants: {
    size: {
      lg: "ml-8",
      default: "ml-6",
      sm: "ml-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, type, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex flex-row items-center relative",
          inputVariants({ size, className }),
          className,
        )}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search01Icon size={inputIconSizeMap[size ?? "default"]} />
        </div>
        <input
          type={type}
          ref={ref}
          {...props}
          className={cn(
            searchInputVariants({ size }),
            "w-full grow bg-transparent",
          )}
        />
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
