import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { useSafeAction } from "@/shared/hooks/use-safe-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { changePasswordAction } from "../actions";
import { authSchema } from "../lib/validation";
import { FormWrapper } from "./form-wrapper";

import {
  Button,
  Form,
  PasswordFieldWithValidation,
  ProgressCircle,
  TextField,
} from "@/shared/components/ui";

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

  const { execute: changePassword, isExecuting } = useSafeAction(
    changePasswordAction,
    {
      onSuccess: () => {
        form.reset();
        toast.success("Password updated!");
        router.push("/login");
      },
    },
  );

  const onSubmit = (value: UpdatePasswordSchema) => {
    const { registerPassword } = value;

    if (!token) {
      toast.error("Token is missing!");
      return;
    }

    changePassword({
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
              isDisabled={isExecuting}
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
              isDisabled={isExecuting}
              autoComplete="confirm-password"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />

        <div className="space-y-3">
          <Button className="w-full" type="submit" isPending={isExecuting}>
            {isExecuting && (
              <ProgressCircle isIndeterminate aria-label="Registering..." />
            )}
            Update
          </Button>
          <Button
            appearance="plain"
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
