import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { InputOTP } from "@/ui/input-otp";
import { Link } from "@/ui/link";
import { ProgressCircle } from "@/ui/progress-circle";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { credentialsSignIn } from "@/data-access/auth/mutations";
import { CredentialsSignInSchema } from "@/data-access/auth/schemas";
import { isDataAccessError } from "@/data-access/errors";
import { sendTwoFactorEmail } from "@/data-access/two-factor-token/mutations";
import { SendTwoFactorTokenEmailSchema } from "@/data-access/two-factor-token/schemas";
import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { useLoginSuccess } from "../hooks/use-login-success";
import { authSchema } from "../lib/validation";
import { FormWrapper } from "./form-wrapper";

const twoFactorSchema = authSchema.pick({
  code: true,
});

type twoFactorSchema = z.infer<typeof twoFactorSchema>;

const useTwoFactor = () =>
  useAuthStore(
    useShallow(({ setStep, data }) => ({
      data,
      setStep,
    })),
  );

export const TwoFactor = () => {
  const { setStep, data } = useTwoFactor();
  const [counter, setCounter] = useState(60);
  const onLoginSuccess = useLoginSuccess();
  const form = useForm<twoFactorSchema>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  });

  const { mutate: sendTwoFactorEmailMutation } = useProtectedMutation({
    requireAuth: false,
    schema: SendTwoFactorTokenEmailSchema,
    mutationFn: sendTwoFactorEmail,
    onSuccess: (result) => {
      if (isDataAccessError(result)) {
        switch (result.type) {
          case "EMAIL_SENDING_FAILED":
            toast.error("Error sending 2FA email");
            break;
          default:
        }
        return;
      }
      setCounter(60);
      toast.success("2FA email sent! Please check your email.");
    },
    onError: () => {
      toast.error("Something went wrong! Please try again.");
    },
  });

  const { mutate: signInMutation, isPending } = useProtectedMutation({
    requireAuth: false,
    schema: CredentialsSignInSchema,
    mutationFn: credentialsSignIn,
    onSuccess: (result) => {
      if (isDataAccessError(result)) {
        switch (result.type) {
          case "INVALID_TOKEN":
            toast.error("Invalid 2FA code");
            break;
          case "TOKEN_EXPIRED":
            toast.error("2FA code has expired");
            break;
          default:
        }
        return;
      }

      form.reset();
      onLoginSuccess();
    },
    onError: () => {
      toast.error("Something went wrong! Please try again.");
    },
  });

  const onSubmit = async (value: twoFactorSchema) => {
    const { code } = value;
    const { email, loginPassword } = data;

    if (!email || !code || !loginPassword) return;

    signInMutation({ email, password: loginPassword, code });
  };

  const onBack = () => {
    form.reset();
    setStep("LANDING");
  };

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => {
      timer && clearInterval(timer);
    };
  }, [counter]);

  return (
    <FormWrapper
      header="Two-factor authentication"
      subHeader="Enter the 2FA code we emailed you to continue"
      backButton
      backButtonOnClick={onBack}
      className="space-y-6"
    >
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          control={form.control}
          name="code"
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              {...field}
              autoFocus
              aria-label="Two-factor code"
              containerClassName="w-full"
            >
              <InputOTP.Group>
                {[...Array(6)].map((_, index) => (
                  <InputOTP.Slot key={`otp-slot-${index}`} index={index} />
                ))}
              </InputOTP.Group>
            </InputOTP>
          )}
        />

        <div className="w-full items-end flex justify-end mt-1">
          <Link
            intent="secondary"
            className="text-sm cursor-pointer"
            isDisabled={counter > 0}
            onPress={() => {
              if (counter !== 0 || !data.email) return;
              sendTwoFactorEmailMutation({ email: data.email });
            }}
          >
            {counter > 0 ? `Resend code in ${counter}s` : "Resend code"}
          </Link>
        </div>

        <Button className="w-full mt-4" type="submit" isPending={isPending}>
          {isPending && (
            <ProgressCircle isIndeterminate aria-label="Logging in..." />
          )}
          Confirm
        </Button>
      </Form>
    </FormWrapper>
  );
};
