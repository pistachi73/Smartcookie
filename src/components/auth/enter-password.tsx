import { useSafeAction } from "@/hooks/use-safe-action";
import { Loader2 } from "lucide-react";
import type { AuthFormSharedProps } from ".";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { PasswordInput } from "../ui/password-input";
import { signInAction } from "./actions";
import { useAuthContext } from "./auth-context";
import { FormWrapper } from "./form-wrapper";
import { useLoginSuccess } from "./hooks/use-login-success";

type CreatePasswordProps = AuthFormSharedProps;

export const EnterPassword = ({ authForm }: CreatePasswordProps) => {
  const { setFormType } = useAuthContext();
  const { execute: signIn, isExecuting } = useSafeAction(signInAction, {
    onSuccess: ({ data }) => {
      if (data?.twoFactor) {
        setFormType("TWO_FACTOR");
      } else {
        authForm.reset();
        onLoginSuccess();
      }
    },
    onError: () => {
      authForm.setError("loginPassword", { type: "informative" });
    },
  });
  const onLoginSuccess = useLoginSuccess();

  const onBack = () => {
    authForm.reset();
    setFormType("LANDING");
  };

  const onLogin = async () => {
    const [password, email] = authForm.getValues(["loginPassword", "email"]);

    const typeCheckSuccess = await authForm.trigger(
      ["loginPassword", "email"],
      { shouldFocus: true },
    );

    if (!typeCheckSuccess || !email || !password) return;

    signIn({ email, password });
  };

  return (
    <FormWrapper
      header="Enter your password"
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
        <input
          type="text"
          name="email"
          value={authForm.getValues("email")}
          readOnly
          autoComplete="email"
          className="hidden"
        />
        <FormField
          control={authForm.control}
          name="loginPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex w-full items-center justify-between">
                Password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoFocus
                  placeholder="******"
                  disabled={isExecuting}
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
              <Button
                size="inline"
                variant="link"
                className="text-sm font-light text-neutral-500"
                type="button"
                onPress={() => {
                  setFormType("RESET_PASSWORD");
                }}
              >
                Forgot password?
              </Button>
            </FormItem>
          )}
        />
        <Button className="w-full mt-4" type="submit" isDisabled={isExecuting}>
          {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </form>
    </FormWrapper>
  );
};
