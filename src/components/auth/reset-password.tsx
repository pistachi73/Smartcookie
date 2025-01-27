import { useSafeAction } from "@/hooks/use-safe-action";
import { Loader2 } from "lucide-react";
import { Form } from "react-aria-components";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { AuthFormSharedProps } from ".";
import { Button } from "../ui/button";
import { TextField } from "../ui/react-aria/text-field";
import { resetPasswordAction } from "./actions";
import { useAuthContext } from "./auth-context";
import { useAuthSettingsContextUpdater } from "./auth-settings-context";
import { FormWrapper } from "./form-wrapper";

type ResetPasswordProps = AuthFormSharedProps;

export const ResetPassword = ({ authForm }: ResetPasswordProps) => {
  const { setOpen } = useAuthSettingsContextUpdater();
  const { setFormType } = useAuthContext();

  const { executeAsync: asyncResetPassword, isExecuting } = useSafeAction(
    resetPasswordAction,
    {
      onSuccess: () => {
        authForm.reset();
        setOpen(false);
        toast.success("Password reset email sent!");
      },
    },
  );

  const onBack = () => {
    authForm.reset();
    setFormType("LANDING");
  };

  const onReset = async () => {
    const typeCheckSuccess = await authForm.trigger(["email"], {
      shouldFocus: true,
    });

    const [email] = authForm.getValues(["email"]);

    if (!email || !typeCheckSuccess) {
      return;
    }

    await asyncResetPassword(email);
  };

  return (
    <FormWrapper
      header="Reset your password"
      subHeader="Introduce your email and we will send you a link to reset your password."
      backButton
      backButtonOnClick={onBack}
      className="space-y-6"
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onReset();
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

        <Button className="w-full mt-4" type="submit" isDisabled={isExecuting}>
          {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send link to reset password
        </Button>
      </Form>
    </FormWrapper>
  );
};
