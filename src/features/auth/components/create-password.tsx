import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/ui/button";
import { PasswordFieldWithValidation } from "@/ui/password-field-with-validation";
import { ProgressCircle } from "@/ui/progress-circle";
import { TextField } from "@/ui/text-field";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { credentialsSignUp } from "@/data-access/auth/mutations";
import { CredentialsSignUpSchema } from "@/data-access/auth/schemas";
import { isDataAccessError } from "@/data-access/errors";
import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { authSchema } from "../lib/validation";
import { FormWrapper } from "./form-wrapper";

const createPasswordSchema = authSchema
  .pick({
    registerPassword: true,
    registerPasswordConfirm: true,
  })
  .refine((data) => data.registerPassword === data.registerPasswordConfirm, {
    path: ["registerPasswordConfirm"],
    message: "Passwords does not match",
  });

type CreatePasswordSchema = z.infer<typeof createPasswordSchema>;

const useAuthCreatePassword = () =>
  useAuthStore(
    useShallow(({ setData, setStep, data }) => ({
      setData,
      setStep,
      data,
    })),
  );

export const CreatePassword = () => {
  const { setData, setStep, data } = useAuthCreatePassword();
  const form = useForm<CreatePasswordSchema>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      registerPassword: "",
      registerPasswordConfirm: "",
    },
  });

  const { mutate: credentialsSignUpMutation, isPending: isRegistering } =
    useProtectedMutation({
      requireAuth: false,
      schema: CredentialsSignUpSchema,
      mutationFn: credentialsSignUp,
      onSuccess: (result) => {
        if (isDataAccessError(result)) {
          switch (result.type) {
            case "DUPLICATE_RESOURCE":
              toast.error("Email already in use");
              break;
            case "EMAIL_SENDING_FAILED":
              toast.error("Failed to send email verification");
              break;
            default:
              toast.error("Something went wrong, please try again later.");
          }
          return;
        }

        if (result.emailVerification) {
          setStep("VERIFY_EMAIL");
        } else {
          toast.error("Something went wrong, please try again later.");
        }
      },
    });

  const onBack = () => {
    form.reset();
    setStep("LANDING");
  };

  const onSubmit = async (values: CreatePasswordSchema) => {
    const { registerPassword, registerPasswordConfirm } = values;
    const { email } = data;

    if (!email) return;
    setData({
      registerPassword,
      registerPasswordConfirm,
    });
    credentialsSignUpMutation({
      email,
      password: registerPassword,
    });
  };

  return (
    <FormWrapper
      header="Create a password"
      subHeader="Create a password to continue."
      backButton
      backButtonOnClick={onBack}
    >
      <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          control={form.control}
          name="registerPassword"
          render={({ field }) => (
            <PasswordFieldWithValidation
              {...field}
              label="Password"
              autoFocus
              placeholder="******"
              isDisabled={isRegistering}
              autoComplete="new-password"
              showValidation={
                form.formState.dirtyFields.registerPassword ||
                form.formState.errors.registerPassword !== undefined
              }
            />
          )}
        />
        <Controller
          control={form.control}
          name="registerPasswordConfirm"
          render={({ field, fieldState: { error, invalid } }) => (
            <TextField
              {...field}
              label="Confirm password"
              placeholder="******"
              type="password"
              isRevealable
              isDisabled={isRegistering}
              autoComplete="confirm-password"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />

        <Button className="w-full mt-4" type="submit" isPending={isRegistering}>
          {isRegistering && (
            <ProgressCircle isIndeterminate aria-label="Registering..." />
          )}
          Register
        </Button>
      </Form>
    </FormWrapper>
  );
};
