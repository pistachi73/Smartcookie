import { Button, buttonVariants } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { useSafeAction } from "@/hooks/use-safe-action";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { AuthFormSharedProps } from ".";
import { changePasswordAction } from "./actions";
import { FormWrapper } from "./form-wrapper";

type UpdatePasswordProps = AuthFormSharedProps;

export const UpdatePassword = ({ authForm }: UpdatePasswordProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { execute: changePassword, isExecuting } = useSafeAction(
    changePasswordAction,
    {
      onSuccess: () => {
        authForm.reset();
        toast.success("Password updated!");
        router.push("/login");
      },
    },
  );

  const onPasswordChange = async () => {
    const typeCheckSuccess = await authForm.trigger(
      ["registerPassword", "registerPasswordConfirm"],
      {
        shouldFocus: true,
      },
    );

    const [registerPassword] = authForm.getValues(["registerPassword"]);

    if (!typeCheckSuccess || !registerPassword) {
      return;
    }

    if (!token) {
      toast.error("Token is missing!");
      return;
    }

    changePassword({
      token,
      password: registerPassword,
    });
  };

  return (
    <FormWrapper
      header="Update password"
      subHeader="Please enter a new password for your account."
      className="space-y-6"
    >
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onPasswordChange();
        }}
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
                  placeholder="******"
                  disabled={isExecuting}
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
                  disabled={isExecuting}
                  autoComplete="confirm-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-3">
          <Button isDisabled={isExecuting} type="submit" className="w-full">
            {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update
          </Button>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
          >
            Back to login
          </Link>
        </div>
      </form>
    </FormWrapper>
  );
};
