import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

import {
  credentialsSignIn,
  credentialsSignUp,
} from "@/data-access/auth/mutations";
import { CredentialsSignUpSchema } from "@/data-access/auth/schemas";
import { isDataAccessError } from "@/data-access/errors";
import { sendEmailVerificationEmail } from "@/data-access/verification-token/mutations";
import { SendEmailVerificationEmailSchema } from "@/data-access/verification-token/schemas";
import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { authSchema } from "../lib/validation";
import { FormWrapper } from "./form-wrapper";

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

  const { mutate: credentialsSignUpMutation, isPending: isVerifying } =
    useProtectedMutation({
      requireAuth: false,
      schema: CredentialsSignUpSchema,
      mutationFn: credentialsSignUp,
      onSuccess: async (result) => {
        if (isDataAccessError(result)) {
          switch (result.type) {
            case "DUPLICATE_RESOURCE":
              toast.error("Email already in use");
              break;
            case "INVALID_TOKEN":
              toast.error("Invalid email verification token");
              break;
            case "TOKEN_EXPIRED":
              toast.error("Email verification token expired");
              break;
            case "EMAIL_SENDING_FAILED":
              toast.error("Failed to send email verification");
              break;
            default:
              toast.error("Something went wrong, please try again later.");
          }
          return;
        }

        if (!data.email || !data.registerPassword) {
          router.push("/auth/login");
          return;
        }

        const signInResult = await credentialsSignIn({
          email: data.email,
          password: data.registerPassword,
        });

        if (isDataAccessError(signInResult)) {
          toast.error(
            "Account created but sign-in failed. Please try logging in manually.",
          );
          router.push("/login");
          return;
        }

        toast.success("Account created successfully!");
        router.push("/portal/dashboard");
      },
    });

  const { mutate: resendEmailVerificationEmail } = useProtectedMutation({
    requireAuth: false,
    schema: SendEmailVerificationEmailSchema,
    mutationFn: sendEmailVerificationEmail,
    onSuccess: (result) => {
      if (isDataAccessError(result)) {
        toast.error("Failed to send email verification");
        return;
      }
      setCounter(60);
      toast.success("Verification code sent to your email");
    },
    onError: () => {
      toast.error("Something went wrong, please try again later.");
    },
  });

  const onSubmit = async (value: EmailVerificationSchema) => {
    const { code } = value;
    const { registerPassword, email } = data;

    if (!registerPassword || !email) return;
    console.log({ registerPassword, email });

    credentialsSignUpMutation({
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
                {Array.from({ length: 6 }).map((_, index) => (
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
              if (counter !== 0 || !data.email) return;
              resendEmailVerificationEmail({ email: data.email });
            }}
          >
            {counter > 0 ? `Resend code in ${counter}s` : "Resend code"}
          </Link>
        </div>

        <Button className="w-full mt-4" type="submit" isPending={isVerifying}>
          {isVerifying && (
            <ProgressCircle isIndeterminate aria-label="Verifying email..." />
          )}
          Verify email
        </Button>
      </Form>
    </FormWrapper>
  );
};
