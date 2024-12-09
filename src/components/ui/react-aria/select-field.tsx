import { cn } from "@/lib/utils";
import { Select, type SelectProps } from "react-aria-components";
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
