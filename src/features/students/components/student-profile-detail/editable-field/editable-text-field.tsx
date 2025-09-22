import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/shared/components/ui/form";
import { TextField } from "@/shared/components/ui/text-field";
import { cn } from "@/shared/lib/utils";

import type {
  EditableTextFieldComponentProps,
  TextFieldType,
} from "./editable-field.types";
import { EditableFieldSuffix } from "./editable-field-suffix";

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
  readOnly = false,
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
    console.log("data", data);
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
            onFocus={() => {
              if (readOnly) return;
              setIsEditing(true);
            }}
            onBlur={handleBlur}
            isRequired={isRequired}
            className={{
              primitive: cn(readOnly && "pointer-events-none"),
              fieldGroup: cn(
                "bg-bg py-1.5 pr-2 *:sm:text-base",
                isEditing
                  ? "inset-ring-border"
                  : "inset-ring-transparent shadow-none",
              ),
            }}
            isReadOnly={!isEditing || readOnly}
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
