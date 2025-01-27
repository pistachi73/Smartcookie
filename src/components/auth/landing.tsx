import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Form } from "react-aria-components";
import { Controller } from "react-hook-form";
import type { AuthFormSharedProps } from ".";
import { Button } from "../ui/button";
import { TextField } from "../ui/react-aria/text-field";
import { getUserAndAccountByEmailAction } from "./actions";
import { useAuthContext } from "./auth-context";
import { FormWrapper } from "./form-wrapper";
import { SocialButton } from "./oauth-button";

type LandingProps = AuthFormSharedProps;

export const Landing = ({ authForm }: LandingProps) => {
  const { setFormType } = useAuthContext();
  const { executeAsync, isExecuting } = useAction(
    getUserAndAccountByEmailAction,
  );

  const onContinue = async () => {
    const success = await authForm.trigger("email", { shouldFocus: true });
    if (!success) return;

    const email = authForm.getValues("email");
    const result = await executeAsync(email);

    if (result?.data?.user && result.data.account) {
      return;
    }

    if (result?.data?.user) {
      setFormType("ENTER_PASSWORD");
    } else {
      setFormType("CREATE_PASSWORD");
    }
  };

  return (
    <FormWrapper
      header="Welcome to OH Subscription!"
      subHeader="Log in or register to get started."
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
      >
        <Controller
          control={authForm.control}
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

        <Button
          className="w-full mt-4"
          onPress={onContinue}
          type="submit"
          isDisabled={isExecuting}
        >
          {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </Form>
      <span className="my-6 block w-full text-center text-xs font-medium text-muted-foreground">
        OR
      </span>
      <div className="space-y-3">
        <SocialButton provider="google" />
        <SocialButton provider="apple" />
      </div>
    </FormWrapper>
  );
};
