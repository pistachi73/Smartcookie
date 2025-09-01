import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CancelIcon,
  FloppyDiskIcon,
  PencilEdit01Icon,
  type User02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useState } from "react";
import type { DateValue, InputProps } from "react-aria-components";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { DateField } from "@/shared/components/ui/date-field";
import { Form } from "@/shared/components/ui/form";
import { PhoneField } from "@/shared/components/ui/phone-field";
import { TextField } from "@/shared/components/ui/text-field";
import { cn } from "@/shared/lib/utils";

const EditableFieldSuffix = ({
  isEditing,
  onEdit,
  onCancel,
}: {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="flex items-center gap-0.5">
      {isEditing ? (
        <>
          <Button
            size="sq-xs"
            type="submit"
            intent="plain"
            className=" text-primary hover:bg-primary hover:text-primary-fg"
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
          </Button>
          <Button
            size="sq-xs"
            intent="plain"
            type="button"
            onPress={onCancel}
            className="hover:bg-secondary"
          >
            <HugeiconsIcon icon={CancelIcon} size={16} />
          </Button>
        </>
      ) : (
        <Button
          size="sq-xs"
          type="button"
          intent="plain"
          onPress={onEdit}
          className="shrink-0 hover:bg-secondary group-hover:flex hidden"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
        </Button>
      )}
    </div>
  );
};

interface EditableFieldProps<T> {
  value?: T;
  label: string;
  onSave: (value?: T) => void;
  placeholder?: string;
  customErrorMessage?: string;
  isRequired?: boolean;
  icon?: typeof User02Icon;
}

type TextFieldType = Exclude<InputProps["type"], "password">;

interface EditableTextFieldComponentProps extends EditableFieldProps<string> {
  type?: TextFieldType;
}

const getValidationSchema = (
  type: TextFieldType,
  isRequired?: boolean,
  customMessage?: string,
) => {
  switch (type) {
    case "email":
      return z.string().email(customMessage ?? "Please enter a valid email");

    default:
      return isRequired
        ? z.string().min(1, customMessage ?? "This field is required")
        : z.string().optional();
  }
};

export const EditableTextField = ({
  value,
  label,
  onSave,
  type = "text",
  placeholder,
  isRequired = false,
  customErrorMessage,
  icon: Icon,
}: EditableTextFieldComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const fieldSchema = getValidationSchema(type, isRequired, customErrorMessage);
  const formSchema = z.object({
    field: fieldSchema,
  });

  const form = useForm({
    defaultValues: {
      field: value ?? "",
    },
    resolver: zodResolver(formSchema),
  });

  const fieldValue = useWatch({
    control: form.control,
    name: "field",
  });

  const handleCancel = () => {
    form.setValue("field", value ?? "");
    setIsEditing(false);
  };

  const handleBlur = () => {
    if (fieldValue === (value ?? "")) {
      handleCancel();
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isRequired && !data.field) {
      handleCancel();
      return;
    }
    onSave(data.field);
    setIsEditing(false);
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="field"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            type={type}
            label={label}
            placeholder={placeholder}
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            isRequired={isRequired}
            className={{
              fieldGroup: cn(
                "bg-bg py-1.5 pr-2 *:sm:text-base",
                isEditing
                  ? "inset-ring-border"
                  : "inset-ring-transparent shadow-none",
              ),
            }}
            isReadOnly={!isEditing}
            errorMessage={fieldState.error?.message}
            isInvalid={fieldState.invalid}
            prefix={Icon && <HugeiconsIcon icon={Icon} data-slot="icon" />}
            suffix={
              <EditableFieldSuffix
                isEditing={isEditing}
                onEdit={() => {
                  setIsEditing(true);
                }}
                onCancel={handleCancel}
              />
            }
          />
        )}
      />
    </Form>
  );
};

export const EditableDateField = ({
  value,
  label,
  icon: Icon,
  onSave,
  isRequired = false,
}: EditableFieldProps<DateValue>) => {
  const [isEditing, setIsEditing] = useState(false);

  const formSchema = z.object({
    field: z.custom<DateValue>().optional(),
  });

  const form = useForm({
    defaultValues: {
      field: value,
    },
    resolver: zodResolver(formSchema),
  });

  const fieldValue = useWatch({
    control: form.control,
    name: "field",
  });

  const handleCancel = () => {
    form.setValue("field", value);
    setIsEditing(false);
  };

  const handleBlur = () => {
    if (value && fieldValue?.compare(value) === 0) {
      handleCancel();
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave(data.field);
    setIsEditing(false);
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="field"
        render={({ field, fieldState }) => (
          <DateField
            {...field}
            label={label}
            isRequired={isRequired}
            autoFocus
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            className={{
              fieldGroup: cn(
                "bg-bg py-1.5 pr-2 *:sm:text-base w-full pl-1.5",
                isEditing
                  ? "inset-ring-border"
                  : "inset-ring-transparent shadow-none",
              ),
              input: "py-1.5 sm:py-1.5 w-full px-3.5 sm:px-3",
            }}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
            isReadOnly={false}
            prefix={Icon && <HugeiconsIcon icon={Icon} data-slot="icon" />}
            suffix={
              <EditableFieldSuffix
                isEditing={isEditing}
                onCancel={handleCancel}
                onEdit={() => {
                  setIsEditing(true);
                }}
              />
            }
          />
        )}
      />
    </Form>
  );
};

export const EditablePhoneField = ({
  value,
  label,
  onSave,
  placeholder,
  isRequired = false,
}: EditableTextFieldComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const formSchema = z.object({
    field: z.string(),
  });

  const form = useForm({
    defaultValues: {
      field: value ?? "",
    },
    resolver: zodResolver(formSchema),
  });

  const fieldValue = useWatch({
    control: form.control,
    name: "field",
  });

  const handleCancel = () => {
    form.setValue("field", value ?? "");
    setIsEditing(false);
  };

  const handleBlur = () => {
    if (fieldValue === (value ?? "")) {
      handleCancel();
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave(data.field);
    setIsEditing(false);
  };

  const handlePhoneValidityChange = (isValid: boolean) => {
    if (!isValid) {
      form.setError("field", {
        type: "manual",
        message: "Please enter a valid phone number",
      });
    } else {
      form.clearErrors("field");
    }
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="field"
        render={({ field, fieldState }) => (
          <PhoneField
            {...field}
            label={label}
            placeholder={placeholder}
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            isRequired={isRequired}
            onValidityChange={(isValid) => handlePhoneValidityChange(isValid)}
            className={{
              fieldGroup: cn(
                "bg-bg py-1.5 pr-2 *:sm:text-base",
                isEditing
                  ? "inset-ring-border"
                  : "inset-ring-transparent shadow-none",
              ),
            }}
            isReadOnly={!isEditing}
            errorMessage={fieldState.error?.message}
            isInvalid={fieldState.invalid}
            suffix={
              <EditableFieldSuffix
                isEditing={isEditing}
                onEdit={() => {
                  setIsEditing(true);
                }}
                onCancel={handleCancel}
              />
            }
          />
        )}
      />
    </Form>
  );
};
