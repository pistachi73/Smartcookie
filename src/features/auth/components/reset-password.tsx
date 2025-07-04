import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { authSchema } from "../lib/validation";
import { FormWrapper } from "./form-wrapper";

import { resetPassword } from "@/data-access/auth/mutations";
import { ResetPasswordSchema } from "@/data-access/auth/schemas";
import { isDataAccessError } from "@/data-access/errors";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { ProgressCircle } from "@/ui/progress-circle";
import { TextField } from "@/ui/text-field";
import { toast } from "sonner";

const authResetPasswordSchema = authSchema.pick({
  email: true,
});

type AuthResetPasswordSchema = z.infer<typeof authResetPasswordSchema>;

const useAuthResetPassword = () =>
  useAuthStore(
    useShallow(({ setData, setStep, data }) => ({
      setData,
      setStep,
      data,
    })),
  );

export const ResetPassword = () => {
  const { setStep, data } = useAuthResetPassword();
  const router = useRouter();
  const form = useForm<AuthResetPasswordSchema>({
    resolver: zodResolver(authResetPasswordSchema),
    defaultValues: {
      email: data?.email ?? "",
    },
    mode: "onChange",
  });

  // const { execute: resetPassword, isExecuting } = useSafeAction(
  //   resetPasswordAction,
  //   {
  //     onSuccess: () => {
  //       form.reset();
  //       router.push("/");
  //       toast.success("Password reset email sent!");
  //     },
  //   },
  // );

  const { mutate, isPending } = useProtectedMutation({
    requireAuth: false,
    schema: ResetPasswordSchema,
    mutationFn: resetPassword,
    onSuccess: (result) => {
      if (isDataAccessError(result)) {
        switch (result.type) {
          case "NOT_FOUND":
            toast.warning("Email not found!");
            break;
          case "DATABASE_ERROR":
            toast.error("Error generating password reset token");
            break;
          case "EMAIL_SENDING_FAILED":
            toast.error("Error sending password reset email");
            break;
        }
        return;
      }

      form.reset();
      router.push("/");
      toast.success("Password reset email sent! Please check your email.");
    },
  });

  const onBack = () => {
    form.reset();
    setStep("LANDING");
  };

  const onSubmit = (value: AuthResetPasswordSchema) => {
    mutate(value);
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
              isDisabled={isPending}
            />
          )}
        />

        <Button className="w-full mt-4" type="submit" isPending={isPending}>
          {isPending && (
            <ProgressCircle isIndeterminate aria-label="Creating..." />
          )}
          Send link to reset password
        </Button>
      </Form>
    </FormWrapper>
  );
};
