import { cn } from "@/lib/utils";
import { Tick01Icon } from "@hugeicons/react";
import { cva } from "class-variance-authority";
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  composeRenderProps,
} from "react-aria-components";

interface ListBoxProps<T>
  extends Omit<AriaListBoxProps<T>, "layout" | "orientation"> {}

export function ListBox<T extends object>({
  children,
  ...props
}: ListBoxProps<T>) {
  return (
    <AriaListBox {...props} className={cn(props.className)}>
      {children}
    </AriaListBox>
  );
}

export const itemStyles = cva(
  "p-2 relative flex items-center cursor-default select-none rounded-sm text-sm",
  {
    variants: {
      isSelected: {
        true: "dark:bg-primary-900/60 bg-primary-100/60 hover:bg-primary-100/80 dark:hover:bg-primary-900/80",
      },
      isHovered: {
        true: "bg-background-base-highlight",
      },
      isFocusVisible: {
        true: "inset-ring-[3px] inset-hover:bg-background-base-highlight  ",
      },
      isDisabled: {
        true: "pointer-events-none opacity-50",
      },
    },
  },
);

type ListBoxItemProps = AriaListBoxItemProps & {
  showCheckIcon?: boolean;
  children: React.ReactNode;
};

export function ListBoxItem({
  showCheckIcon = false,
  ...props
}: ListBoxItemProps) {
  const textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaListBoxItem {...props} textValue={textValue} className={itemStyles}>
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          <span className="flex items-center flex-1 gap-2">{children}</span>
          {showCheckIcon && (
            <span className="flex items-center w-4">
              {isSelected && <Tick01Icon size={16} />}
            </span>
          )}
        </>
      ))}
    </AriaListBoxItem>
  );
}
