import { isValidPhoneNumber } from "libphonenumber-js/min";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

import { PhoneField } from "@/shared/components/ui/phone-field";
import { TextField } from "@/shared/components/ui/text-field";

export const CreateStudentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().refine(
    (phone) => {
      if (!phone) return true; // Allow empty phone
      try {
        return isValidPhoneNumber(phone);
      } catch (_e) {
        return false;
      }
    },
    { message: "Please enter a valid phone number" },
  ),
});

type CreateStudentFormProps = {
  autoFocus?: boolean;
};

export const CreateStudentForm = ({
  autoFocus = false,
}: CreateStudentFormProps) => {
  const form = useFormContext<z.infer<typeof CreateStudentFormSchema>>();
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
          />
        )}
      />
    </>
  );
};
