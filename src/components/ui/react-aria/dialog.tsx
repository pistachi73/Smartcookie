import { cn } from "@/lib/utils";
import { type DialogProps, Dialog as RACDialog } from "react-aria-components";

export const Dialog = (props: DialogProps) => {
  return (
    <RACDialog
      {...props}
      className={cn(
        "bg-elevated p-6 [[data-placement]>&]:p-4 max-h-[inherit] overflow-auto relative rounded-2xl",
        props.className,
      )}
    />
  );
};
