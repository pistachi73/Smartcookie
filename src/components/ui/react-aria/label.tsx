import { cn } from "@/lib/utils";
import type { LabelProps as AriaLabelProps } from "react-aria-components";
import { Label as AriaLabel } from "react-aria-components";

type LabelProps = AriaLabelProps & {
  children: React.ReactNode;
};

export const Label = ({ className, ...props }: LabelProps) => {
  return (
    <AriaLabel
      className={cn(
        "mb-1 block text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
};
