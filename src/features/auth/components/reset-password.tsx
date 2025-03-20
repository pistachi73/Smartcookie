import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { useSafeAction } from "@/shared/hooks/use-safe-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { resetPasswordAction } from "../actions";
import { authSchema } from "../lib/validation";
import { FormWrapper } from "./form-wrapper";

import {
  Button,
  Form,
  ProgressCircle,
  TextField,
} from "@/shared/components/ui";

const authResetPasswordSchema = authSchema.pick({
  email: true,
});

type AuthResetPasswordSchema = z.infer<typeof authResetPasswordSchema>;

const useAuthResetPassword = () =>
  useAuthStore(
    useShallow(({ setData, setStep }) => ({
      setData,
      setStep,
    })),
  );

export const ResetPassword = () => {
  const { setData, setStep } = useAuthResetPassword();
  const router = useRouter();
  const form = useForm<AuthResetPasswordSchema>({
    resolver: zodResolver(authResetPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const { execute: resetPassword, isExecuting } = useSafeAction(
    resetPasswordAction,
    {
      onSuccess: () => {
        form.reset();
        router.push("/");
        toast.success("Password reset email sent!");
      },
    },
  );

  const onBack = () => {
    form.reset();
    setStep("LANDING");
  };

  const onSubmit = (value: AuthResetPasswordSchema) => {
    const { email } = value;
    resetPassword(email);
  };

  return (
    <FormWrapper
      header="Reset your password"
      subHeader="Introduce your email and we will send you a link to reset your password."
      backButton
      backButtonOnClick={onBack}
      className="space-y-6"
    >
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState: { error, invalid } }) => (
            <TextField
              {...field}
              label="Email"
              validationBehavior="aria"
              isInvalid={invalid}
              errorMessage={error?.message}
              isDisabled={isExecuting}
            />
          )}
        />

        <Button className="w-full mt-4" type="submit" isPending={isExecuting}>
          {isExecuting && (
            <ProgressCircle isIndeterminate aria-label="Creating..." />
          )}
          Send link to reset password
        </Button>
      </Form>
    </FormWrapper>
  );
};
