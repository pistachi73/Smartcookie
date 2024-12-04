import { cn } from "@/lib/utils";
import { Text, type TextProps } from "react-aria-components";

export const FieldDescripton = ({ className, ...props }: TextProps) => {
  return (
    <Text
      slot="description"
      className={cn("text-xs text-neutral-500", className)}
      {...props}
    />
  );
};
