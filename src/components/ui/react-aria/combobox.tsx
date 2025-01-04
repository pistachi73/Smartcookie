import { cn } from "@/lib/utils";
import { ComboBox, type ComboBoxProps } from "react-aria-components";
import { FieldDescripton } from "./field-description";
import { FieldError } from "./field-error";
import { Label } from "./label";
import { ListBox, listBoxitemStyles } from "./list-box";
import { Popover, type PopoverProps } from "./popover";

export type ComboBoxFieldProps<T extends object> = Omit<
  ComboBoxProps<T>,
  "children"
> & {
  children: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string;
};

export const ComboBoxField = <T extends object>({
  children,
  label,
  description,
  errorMessage,
  className,
  allowsEmptyCollection = true,
  ...props
}: ComboBoxFieldProps<T>) => {
  return (
    <ComboBox
      {...props}
      allowsEmptyCollection={allowsEmptyCollection}
      className={({ isDisabled }) => cn(className, isDisabled && "opacity-60")}
    >
      {label && <Label>{label}</Label>}
      {children}
      {description && <FieldDescripton>{description}</FieldDescripton>}
      <FieldError errorMessage={errorMessage} />
    </ComboBox>
  );
};

export type ComboBoxFieldContentProps<T extends object> = Omit<
  PopoverProps,
  "children"
> & {
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
};

export const ComboBoxFieldContent = <T extends object>({
  items,
  children,
  ...props
}: ComboBoxFieldContentProps<T>) => {
  return (
    <Popover {...props}>
      <ListBox
        items={items}
        renderEmptyState={() => {
          return (
            <div className={cn(listBoxitemStyles(), "text-text-sub")}>
              No results found
            </div>
          );
        }}
      >
        {children}
      </ListBox>
    </Popover>
  );
};
