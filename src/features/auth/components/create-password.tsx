import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { useSafeAction } from "@/shared/hooks/use-safe-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { authSchema } from "../lib/validation";
import { FormWrapper } from "./form-wrapper";

import { Button } from "@/ui/button";
import { PasswordFieldWithValidation } from "@/ui/password-field-with-validation";
import { ProgressCircle } from "@/ui/progress-circle";
import { TextField } from "@/ui/text-field";
import { registerAction } from "../actions";

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

  const { executeAsync: asyncRegsiter, isExecuting: isRegistering } =
    useSafeAction(registerAction);

  const onBack = () => {
    form.reset();
    setStep("LANDING");
  };

  const onSubmit = async (values: CreatePasswordSchema) => {
    const { registerPassword, registerPasswordConfirm } = values;
    const { email } = data;

    if (!email) return;

    const result = await asyncRegsiter({
      email,
      password: registerPassword,
    });

    if (result?.serverError || result?.validationErrors) {
      return;
    }

    setData({
      registerPassword,
      registerPasswordConfirm,
    });

    if (result?.data?.emailVerification) {
      setStep("VERIFY_EMAIL");
    } else {
      toast.error("Something went wrong, please try again later.");
    }
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
