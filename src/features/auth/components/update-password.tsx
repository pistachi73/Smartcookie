import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { authSchema } from "../lib/validation";
import { FormWrapper } from "./form-wrapper";

import { changePassword } from "@/data-access/auth/mutations";
import { ChangePasswordSchema } from "@/data-access/auth/schemas";
import { isDataAccessError } from "@/data-access/errors";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { PasswordFieldWithValidation } from "@/ui/password-field-with-validation";
import { ProgressCircle } from "@/ui/progress-circle";
import { TextField } from "@/ui/text-field";

const updatePasswordSchema = authSchema
  .pick({
    registerPassword: true,
    registerPasswordConfirm: true,
  })
  .refine((data) => data.registerPassword === data.registerPasswordConfirm, {
    path: ["registerPasswordConfirm"],
    message: "Passwords does not match",
  });

type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

const useAuthUpdatePassword = () =>
  useAuthStore(
    useShallow(({ setStep }) => ({
      setStep,
    })),
  );

export const UpdatePassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { setStep } = useAuthUpdatePassword();

  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      registerPassword: "",
      registerPasswordConfirm: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useProtectedMutation({
    requireAuth: false,
    schema: ChangePasswordSchema,
    mutationFn: changePassword,
    onSuccess: (result) => {
      if (isDataAccessError(result)) {
        switch (result.type) {
          case "INVALID_TOKEN":
            toast.error("Invalid token!");
            break;
          case "TOKEN_EXPIRED":
            toast.error("Token has expired!");
            break;
          case "NOT_FOUND":
            toast.error("User not found!");
            break;
          default:
        }
        return;
      }
      form.reset();
      toast.success("Password updated! Please login with your new password.");
      setStep("LANDING");
    },
  });

  const onSubmit = (value: UpdatePasswordSchema) => {
    const { registerPassword } = value;

    if (!token) {
      toast.error("Token is missing!");
      return;
    }

    mutate({
      token,
      password: registerPassword,
    });
  };

  return (
    <FormWrapper
      header="Update password"
      subHeader="Please enter a new password for your account."
      className="space-y-6"
    >
      <Form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          control={form.control}
          name="registerPassword"
          render={({ field }) => (
            <PasswordFieldWithValidation
              {...field}
              label="Password"
              autoFocus
              placeholder="******"
              isDisabled={isPending}
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
              isDisabled={isPending}
              autoComplete="confirm-password"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />

        <div className="space-y-3">
          <Button className="w-full" type="submit" isPending={isPending}>
            {isPending && (
              <ProgressCircle isIndeterminate aria-label="Registering..." />
            )}
            Update
          </Button>
          <Button
            intent="plain"
            onPress={() => {
              setStep("LANDING");
            }}
            className="w-full"
          >
            Back to login
          </Button>
        </div>
      </Form>
    </FormWrapper>
  );
};
