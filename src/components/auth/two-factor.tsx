import { useSafeAction } from "@/hooks/use-safe-action";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { AuthFormSharedProps } from ".";
import { Button } from "../ui/button";
import { CodeInput } from "../ui/code-input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import {
  resendTwoFactorVerificationEmailAction,
  signInAction,
} from "./actions";
import { useAuthContext } from "./auth-context";
import { FormWrapper } from "./form-wrapper";
import { useLoginSuccess } from "./hooks/use-login-success";

type TwoFactorProps = AuthFormSharedProps;

export const TwoFactor = ({ authForm }: TwoFactorProps) => {
  const [counter, setCounter] = useState(60);
  const { setFormType } = useAuthContext();
  const onLoginSuccess = useLoginSuccess();
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
        authForm.reset();
        onLoginSuccess();
      },
      onError: () => {
        authForm.setError("code", { type: "informative" });
      },
    },
  );

  const onLogin = async () => {
    const [password, email, code] = authForm.getValues([
      "loginPassword",
      "email",
      "code",
    ]);

    const typeCheckSuccess = await authForm.trigger(
      ["loginPassword", "email", "code"],
      { shouldFocus: true },
    );

    if (!typeCheckSuccess || !email || !password || !code) return;

    signIn({ email, password, code });
  };

  const onBack = () => {
    authForm.reset();
    setFormType("LANDING");
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}
      >
        <FormField
          control={authForm.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CodeInput
                  {...field}
                  length={6}
                  disabled={isExecuting}
                  autoFocus
                />
              </FormControl>
              <Button
                size="inline"
                variant="link"
                className={cn("text-sm font-light text-muted-foreground", {
                  "pointer-events-none": counter > 0,
                })}
                type="button"
                onPress={() => {
                  if (counter !== 0) return;
                  resendTwoFactorVerificationEmail(authForm.getValues("email"));
                }}
              >
                {counter > 0 ? `Resend code in ${counter}s` : "Resend code"}
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full mt-4" type="submit" isDisabled={isExecuting}>
          {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm
        </Button>
      </form>
    </FormWrapper>
  );
};
