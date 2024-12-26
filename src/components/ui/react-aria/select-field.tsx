import { cn } from "@/lib/utils";
import type { FoldersIcon } from "@hugeicons/react";
import { Select, type SelectProps, SelectValue } from "react-aria-components";
import { Button } from "../button";
import { FieldDescripton } from "./field-description";
import { FieldError } from "./field-error";
import { Label } from "./label";
import { ListBox } from "./list-box";
import { Popover, type PopoverProps } from "./popover";

export type SelectFieldProps = SelectProps & {
  children: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string;
};

export const SelectField = ({
  children,
  label,
  description,
  errorMessage,
  className,
  ...props
}: SelectFieldProps) => {
  return (
    <Select {...props} className={cn(className)}>
      {label && <Label>{label}</Label>}
      {children}
      {description && <FieldDescripton>{description}</FieldDescripton>}
      <FieldError errorMessage={errorMessage} />
    </Select>
  );
};

type SelectTriggerProps = React.ComponentProps<typeof Button> & {
  icon?: typeof FoldersIcon;
};

export const SelectTrigger = ({
  className,
  icon: Icon,
  children,
  ...props
}: SelectTriggerProps) => {
  const hasIcon = Icon !== undefined;
  return (
    <Button
      className={cn(className, hasIcon && "pl-0 gap-0 justify-start")}
      {...props}
    >
      {hasIcon && (
        <div className="h-full aspect-square flex items-center justify-center">
          <Icon size={16} className="text-text-sub" />
        </div>
      )}
      {children ? (
        children
      ) : (
        <SelectValue className="data-[placeholder]:text-text-sub" />
      )}
    </Button>
  );
};

type SelectFieldContentProps<T extends object> = Omit<
  PopoverProps,
  "children"
> & {
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
};

export const SelectFieldContent = <T extends object>({
  items,
  children,
  ...props
}: SelectFieldContentProps<T>) => {
  return (
    <Popover {...props}>
      <ListBox items={items}>{children}</ListBox>
    </Popover>
  );
};
