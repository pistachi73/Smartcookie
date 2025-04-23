import { PhoneField } from "@/shared/components/ui/phone-field";
import { TextField } from "@/shared/components/ui/text-field";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { CreateStudentFormSchema } from "../../lib/students.schema";

type CreateStudentFormProps = {
  form: UseFormReturn<z.infer<typeof CreateStudentFormSchema>>;
  autoFocus?: boolean;
};

export const CreateStudentForm = ({
  form,
  autoFocus = false,
}: CreateStudentFormProps) => {
  const { control, setError, clearErrors } = form;

  const handlePhoneValidityChange = (isValid: boolean) => {
    if (!isValid) {
      setError("phone", {
        type: "manual",
        message: "Please enter a valid phone number",
      });
    } else {
      clearErrors("phone");
    }
  };

  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Name"
            placeholder="John Doe"
            isRequired
            validationBehavior="aria"
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
            autoFocus={autoFocus}
            className={{
              input: "text-sm",
            }}
            {...field}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Email"
            placeholder="john@example.com"
            isRequired
            validationBehavior="aria"
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
            className={{
              input: "text-sm",
            }}
            {...field}
          />
        )}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <PhoneField
            label="Phone Number"
            value={field.value}
            onChange={field.onChange}
            onValidityChange={(isValid) => handlePhoneValidityChange(isValid)}
            validationBehavior="aria"
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
            className={{
              input: "text-sm",
            }}
          />
        )}
      />
    </>
  );
};
