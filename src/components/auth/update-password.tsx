import { Button, buttonVariants } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/react-aria/password-field";
import { useSafeAction } from "@/hooks/use-safe-action";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Form } from "react-aria-components";
import { Controller } from "react-hook-form";
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
      <Form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onPasswordChange();
        }}
      >
        <Controller
          control={authForm.control}
          name="registerPassword"
          render={({ field }) => (
            <PasswordField
              {...field}
              label="Password"
              autoFocus
              isDisabled={isExecuting}
              autoComplete="new-password"
              withValidation={
                authForm.formState.dirtyFields.registerPassword ||
                authForm.formState.errors.registerPassword !== undefined
              }
            />
          )}
        />
        <Controller
          control={authForm.control}
          name="registerPasswordConfirm"
          render={({ field, fieldState: { error, invalid } }) => (
            <PasswordField
              {...field}
              label="Confirm password"
              isDisabled={isExecuting}
              autoComplete="confirm-password"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
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
      </Form>
    </FormWrapper>
  );
};
