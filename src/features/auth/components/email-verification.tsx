import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { useSafeAction } from "@/shared/hooks/use-safe-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { authSchema } from "../lib/validation";

import { FormWrapper } from "./form-wrapper";

import {
  Button,
  Form,
  InputOTP,
  Link,
  ProgressCircle,
} from "@/shared/components/ui";
import {
  registerAction,
  resendEmailVerificationEmailAction,
  signInAction,
} from "../actions";

const emailVerificationSchema = authSchema.pick({
  code: true,
});

type EmailVerificationSchema = z.infer<typeof emailVerificationSchema>;

const useEmailVerification = () =>
  useAuthStore(
    useShallow(({ setStep, data }) => ({
      data,
      setStep,
    })),
  );

export const EmailVerification = () => {
  const { setStep, data } = useEmailVerification();
  const form = useForm<EmailVerificationSchema>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: data,
    mode: "onChange",
  });

  const router = useRouter();
  const [counter, setCounter] = useState(0);

  const { executeAsync: registerUser, isExecuting: isRegistering } =
    useSafeAction(registerAction, {
      onSuccess: async ({ data }) => {
        if (!data?.user) return;

        await signInAction({
          email: data.user.email,
          password: data.user.password as string,
        });

        router.push("/calendar");
      },
    });

  const { execute: resendEmailVerificationEmail } = useSafeAction(
    resendEmailVerificationEmailAction,
    {
      onSuccess: () => {
        setCounter(60);
        toast.success("Verification code sent to your email");
      },
    },
  );

  const onSubmit = async (value: EmailVerificationSchema) => {
    const { code } = value;
    const { registerPassword, email } = data;

    if (!registerPassword || !email) return;

    await registerUser({
      email,
      password: registerPassword,
      emailVerificationCode: code,
    });
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
      header="Verify your email"
      subHeader="Enter the verification code we sent to your email."
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
              aria-label="Email verification code"
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
              resendEmailVerificationEmail(data.email);
            }}
          >
            {counter > 0 ? `Resend code in ${counter}s` : "Resend code"}
          </Link>
        </div>

        <Button className="w-full mt-4" type="submit" isPending={isRegistering}>
          {isRegistering && (
            <ProgressCircle isIndeterminate aria-label="Verifying email..." />
          )}
          Verify email
        </Button>
      </Form>
    </FormWrapper>
  );
};
