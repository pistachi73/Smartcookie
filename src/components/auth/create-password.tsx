import { useSafeAction } from "@/hooks/use-safe-action";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { registerAction } from "./actions";
import { useAuthContext } from "./auth-context";
import { FormWrapper } from "./form-wrapper";

type CreatePasswordProps = AuthFormSharedProps;

export const CreatePassword = ({ authForm }: CreatePasswordProps) => {
  const { setFormType } = useAuthContext();
  const { executeAsync: asyncRegsiter, isExecuting: isRegistering } =
    useSafeAction(registerAction);

  const onBack = () => {
    authForm.reset();
    setFormType("LANDING");
  };

  const onNextStep = async () => {
    const [registerPassword, email] = authForm.getValues([
      "registerPassword",
      "email",
    ]);

    if (!registerPassword || !email) return;

    const typeCheckSuccess = await authForm.trigger(
      ["registerPassword", "registerPasswordConfirm", "email"],
      { shouldFocus: true },
    );

    if (!typeCheckSuccess) return;

    const result = await asyncRegsiter({
      email,
      password: registerPassword,
    });

    if (result?.serverError || result?.validationErrors) {
      return;
    }

    if (result?.data?.emailVerification) {
      setFormType("VERIFY_EMAIL");
    } else {
      toast.error("Something went wrong, please try again later.");
    }
  };

  return (
    <FormWrapper
      header="Create a password"
      subHeader="Create a password to continue."
      backButton
      backButtonOnClick={onBack}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNextStep();
        }}
        className="space-y-6"
      >
        <FormField
          control={authForm.control}
          name="registerPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoFocus
                  placeholder="******"
                  disabled={isRegistering}
                  autoComplete="new-password"
                  withValidation={
                    authForm.formState.dirtyFields.registerPassword ||
                    authForm.formState.errors.registerPassword !== undefined
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={authForm.control}
          name="registerPasswordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex w-full items-center justify-between">
                Confirm password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="******"
                  disabled={isRegistering}
                  autoComplete="confirm-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full mt-4" type="submit" disabled={isRegistering}>
          {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register
        </Button>
      </form>
    </FormWrapper>
  );
};
