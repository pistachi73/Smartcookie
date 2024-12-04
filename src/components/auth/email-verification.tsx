import { useSafeAction } from "@/hooks/use-safe-action";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AuthFormSharedProps } from ".";
import { Button } from "../ui/button";
import { CodeInput } from "../ui/code-input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import {
  registerAction,
  resendEmailVerificationEmailAction,
  signInAction,
} from "./actions";
import { useAuthContext } from "./auth-context";
import { useAuthSettingsContextUpdater } from "./auth-settings-context";
import { FormWrapper } from "./form-wrapper";

type EmailVerificationProps = AuthFormSharedProps;

export const EmailVerification = ({ authForm }: EmailVerificationProps) => {
  const { setOpen } = useAuthSettingsContextUpdater();
  const { setFormType } = useAuthContext();
  const router = useRouter();
  const [counter, setCounter] = useState(60);

  const { execute: registerUser, isExecuting: isRegistering } = useSafeAction(
    registerAction,
    {
      onSuccess: async ({ data }) => {
        if (!data?.user) return;

        await signInAction({
          email: data.user.email,
          password: data.user.password as string,
        });

        setOpen(false);
        router.refresh();
      },
    },
  );
  const { execute: resendEmailVerificationEmail } = useSafeAction(
    resendEmailVerificationEmailAction,
    {
      onSuccess: () => {
        setCounter(60);
        toast.success("Verification code sent to your email");
      },
    },
  );

  const onNextStep = async () => {
    const [email, password, code] = authForm.getValues([
      "email",
      "registerPassword",
      "code",
    ]);

    const typecheckSuccess = await authForm.trigger(
      ["registerPassword", "code", "email"],
      { shouldFocus: true },
    );

    if (!typecheckSuccess || !email || !password || !code) return;

    registerUser({
      email,
      password,
      emailVerificationCode: code,
    });
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
      header="Verify your email"
      subHeader="Enter the verification code we sent to your email."
      backButton
      backButtonOnClick={onBack}
      className="space-y-6"
    >
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onNextStep();
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
                  autoFocus
                  disabled={isRegistering}
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
                  resendEmailVerificationEmail(authForm.getValues("email"));
                }}
              >
                {counter > 0 ? `Resend code in ${counter}s` : "Resend code"}
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full mt-4"
          type="submit"
          isDisabled={isRegistering}
        >
          {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify email
        </Button>
      </form>
    </FormWrapper>
  );
};
