import { useSafeAction } from "@/hooks/use-safe-action";
import { Loader2 } from "lucide-react";
import { Form } from "react-aria-components";

import { Controller } from "react-hook-form";
import type { AuthFormSharedProps } from ".";
import { signInAction } from "./actions";
import { useAuthContext } from "./auth-context";
import { FormWrapper } from "./form-wrapper";
import { useLoginSuccess } from "./hooks/use-login-success";

import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/react-aria/password-field";

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
      <Form
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
        <Controller
          control={authForm.control}
          name="loginPassword"
          render={({ field }) => (
            <PasswordField
              {...field}
              autoFocus
              label="Password"
              validationBehavior="aria"
              isDisabled={isExecuting}
            />
          )}
        />

        <div className="w-full items-end flex justify-end mt-1">
          <Button
            size="inline"
            variant="link"
            className="text-sm font-normal text-text-sub"
            type="button"
            onPress={() => {
              setFormType("RESET_PASSWORD");
            }}
          >
            Forgot password?
          </Button>
        </div>

        <Button className="w-full mt-4" type="submit" isDisabled={isExecuting}>
          {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </Form>
    </FormWrapper>
  );
};
