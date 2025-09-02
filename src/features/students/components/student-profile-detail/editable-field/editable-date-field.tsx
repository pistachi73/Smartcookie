import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import type { DateValue } from "react-aria-components";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { DateField } from "@/shared/components/ui/date-field";
import { Form } from "@/shared/components/ui/form";
import { cn } from "@/shared/lib/utils";

import type { EditableFieldProps } from "./editable-field.types";
import { EditableFieldSuffix } from "./editable-field-suffix";

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
