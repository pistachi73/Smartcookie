import { cn } from "@/lib/utils";
import { AlertCircleIcon } from "lucide-react";
import type { FieldErrorProps as AriaFieldErrorProps } from "react-aria-components";
import { FieldError as AriaFieldError } from "react-aria-components";

type FieldErrorProps = AriaFieldErrorProps & {
  children: React.ReactNode;
};

export const FieldError = ({ className, ...props }: FieldErrorProps) => {
  return (
    <AriaFieldError
      className={cn(
        "relative mt-0! h-[25px] animate-form-message-div-down",
        "flex items-center gap-1.5 text-sm font-normal text-destructive",
        className,
      )}
      {...props}
    >
      <AlertCircleIcon size={16} />
      {props.children}
    </AriaFieldError>
  );
};
