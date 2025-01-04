import { cn } from "@/lib/utils";
import { Tick02Icon } from "@hugeicons/react";
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

export const listBoxitemStyles = cva(
  "p-2 relative flex items-center cursor-default select-none rounded-md text-sm",
  {
    variants: {
      isSelected: {
        true: "dark:bg-primary-900/60 bg-primary-100/60 hover:bg-primary-100/80 dark:hover:bg-primary-900/80",
      },
      isHovered: {
        true: "bg-responsive-dark/10",
      },
      isFocusVisible: {
        true: "inset-ring-[2px] inset-ring-responsive-dark/20 bg-responsive-dark/10",
      },
      isDisabled: {
        true: "pointer-events-none opacity-40",
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
    <AriaListBoxItem
      {...props}
      textValue={textValue}
      className={listBoxitemStyles}
    >
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          {showCheckIcon && (
            <span className="flex items-center w-4 mr-2">
              {isSelected && <Tick02Icon size={16} />}
            </span>
          )}
          <span className="flex items-center flex-1 gap-2">{children}</span>
        </>
      ))}
    </AriaListBoxItem>
  );
}
