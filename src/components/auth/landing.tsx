import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import type { AuthFormSharedProps } from ".";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
      >
        <FormField
          control={authForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="email"
                  autoFocus
                  disabled={isExecuting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full mt-4"
          onClick={onContinue}
          type="submit"
          disabled={isExecuting}
        >
          {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </form>
      <span className="my-6 block w-full text-center text-xs font-medium text-muted-foreground">
        OR
      </span>
      <div className="space-y-3">
        <SocialButton provider="google" />
      </div>
    </FormWrapper>
  );
};
