import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/shared/components/ui/form";
import { cn } from "@/shared/lib/utils";

import type { EditableTextFieldComponentProps } from "./editable-field.types";
import { EditableFieldSuffix } from "./editable-field-suffix";

const DynamicPhoneField = dynamic(
  () =>
    import("@/shared/components/ui/phone-field").then((mod) => mod.PhoneField),
  {
    ssr: false,
  },
);

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
          <DynamicPhoneField
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
