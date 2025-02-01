import { useSafeAction } from "@/hooks/use-safe-action";
import { useAuthStore } from "@/providers/auth-store-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import {
  resendTwoFactorVerificationEmailAction,
  signInAction,
} from "./actions";
import { FormWrapper } from "./form-wrapper";
import { useLoginSuccess } from "./hooks/use-login-success";
import { authSchema } from "./validation";

import { Button, Form, InputOTP } from "@/components/ui/new/ui";
import { Link, ProgressCircle } from "../ui/new/ui";

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

  const { execute: resendTwoFactorVerificationEmail } = useSafeAction(
    resendTwoFactorVerificationEmailAction,
    {
      onSuccess: () => {
        setCounter(60);
      },
    },
  );

  const { execute: signIn, isExecuting } = useSafeAction(
    signInAction,

    {
      onSuccess: () => {
        form.reset();
        onLoginSuccess();
      },
      onError: () => {
        form.setError("code", { type: "informative" });
      },
    },
  );

  const onSubmit = async (value: twoFactorSchema) => {
    const { code } = value;
    const { email, loginPassword } = data;

    if (!email || !code || !loginPassword) return;

    signIn({ email, password: loginPassword, code });
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
              className="w-full"
            >
              <InputOTP.Group>
                {[...Array(6)].map((_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: No other option
                  <InputOTP.Slot key={index} index={index} />
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
              console.log(data);
              if (counter !== 0 || !data.email) return;
              resendTwoFactorVerificationEmail(data.email);
            }}
          >
            {counter > 0 ? `Resend code in ${counter}s` : "Resend code"}
          </Link>
        </div>

        <Button className="w-full mt-4" type="submit" isPending={isExecuting}>
          {isExecuting && (
            <ProgressCircle isIndeterminate aria-label="Logging in..." />
          )}
          Confirm
        </Button>
      </Form>
    </FormWrapper>
  );
};
