import type { User02Icon } from "@hugeicons-pro/core-stroke-rounded";
import type { InputProps } from "react-aria-components";

export interface EditableFieldProps<T> {
  value?: T;
  label: string;
  onSave: (value?: T) => void;
  placeholder?: string;
  customErrorMessage?: string;
  isRequired?: boolean;
  icon?: typeof User02Icon;
}

export type TextFieldType = Exclude<InputProps["type"], "password">;

export interface EditableTextFieldComponentProps
  extends EditableFieldProps<string> {
  type?: TextFieldType;
}
