import type {
  ComboBoxProps,
  ListBoxItemProps,
  ValidationResult,
} from "react-aria-components";
import { ComboBox, ListBox, ListBoxItem, Popover } from "react-aria-components";
import { TimeInput } from "./react-aria/time-input";

interface MyComboBoxProps<T extends object>
  extends Omit<ComboBoxProps<T>, "children"> {
  label?: string;
  description?: string | null;
  errorMessage?: string | ((validation: ValidationResult) => string);
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function MyComboBox<T extends object>({
  label,
  description,
  errorMessage,
  children,
  ...props
}: MyComboBoxProps<T>) {
  return (
    <ComboBox {...props} menuTrigger="focus">
      <TimeInput inputSize={"sm"} />
      <Popover>
        <ListBox>{children}</ListBox>
      </Popover>
    </ComboBox>
  );
}

export const TimeSelectContent = ({
  children,
}: { children: React.ReactNode }) => {
  return (
    <Popover>
      <ListBox>{children}</ListBox>
    </Popover>
  );
};

export function ComboBoxItem(props: ListBoxItemProps) {
  return (
    <ListBoxItem
      {...props}
      className={({ isFocused, isSelected }) =>
        `my-item ${isFocused ? "focused" : ""} ${isSelected ? "selected" : ""}`
      }
    />
  );
}
