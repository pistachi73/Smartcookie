import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from "react-aria-components";
import { FieldDescripton } from "./field-description";
import { FieldError } from "./field-error";
import { Label } from "./label";

interface MyRadioGroupProps extends Omit<AriaRadioGroupProps, "children"> {
  children?: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string;
}

export const RadioGroup = ({
  label,
  description,
  errorMessage,
  children,
  className,
  ...props
}: MyRadioGroupProps) => {
  return (
    <AriaRadioGroup {...props} className={cn("flex flex-col gap-2", className)}>
      {label && <Label>{label}</Label>}
      {children}
      {description && (
        <FieldDescripton slot="description">{description}</FieldDescripton>
      )}
      <FieldError errorMessage={errorMessage} />
    </AriaRadioGroup>
  );
};

type RadioProps = AriaRadioProps;

const radioVariants = cva(
  "flex items-center gap-2 px-2 py-1 text-text-base outline-none transition-all before:transition-all before:content-[''] before:size-4 before:bg-background before:rounded-full before:border ",
  {
    variants: {
      isDisabled: {
        true: "cursor-not-allowed opacity-40",
      },
      isFocusVisible: {
        true: "before:ring-[4px] before:ring-base-highlight",
      },
      isSelected: {
        true: "before:border-5 before:border-primary!",
      },
    },
  },
);

export const Radio = ({ className, ...props }: RadioProps) => {
  return (
    <AriaRadio
      {...props}
      className={({ isDisabled, isFocusVisible, isSelected }) =>
        cn(radioVariants({ isDisabled, isFocusVisible, isSelected }), className)
      }
    />
  );
};
