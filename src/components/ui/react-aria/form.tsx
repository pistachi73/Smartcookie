import * as React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { AlertCircleIcon } from "@hugeicons/react";
import type {
  FieldErrorProps,
  LabelProps,
  TextProps,
} from "react-aria-components";
import { FieldError, Label, Text } from "react-aria-components";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn(className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = ({ className, ...props }: LabelProps) => {
  const { error } = useFormField();

  return (
    <Label
      className={cn(
        error && "",
        "mb-2 block text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
};

const FormDescription = ({ className, children, ...props }: TextProps) => {
  return (
    <Text
      slot="description"
      className={cn("text-xs text-neutral-500", className)}
      {...props}
    >
      {children}
    </Text>
  );
};

const FormError = ({ className, children, ...props }: FieldErrorProps) => {
  const { error } = useFormField();

  if (!error?.message) {
    return null;
  }

  return (
    <FieldError
      className="relative mt-0! h-[25px] animate-form-message-div-down"
      {...props}
    >
      <p
        className={cn(
          "absolute top-0 mt-2 flex animate-form-message-p-down items-center gap-1.5 text-sm font-normal text-destructive opacity-0 fill-mode-forwards",
          className,
        )}
      >
        <AlertCircleIcon size={16} />
        {error.message}
      </p>
    </FieldError>
  );
};

export {
  Form,
  FormDescription,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  useFormField,
};
