import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { authSchema } from "../lib/validation";
import { FormWrapper } from "./form-wrapper";
import { SocialButton } from "./oauth-button";

import { getUserAndAccountByEmail } from "@/data-access/user/queries";
import { GetUserAndAccountByEmailSchema } from "@/data-access/user/schemas";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { ProgressCircle } from "@/ui/progress-circle";
import { TextField } from "@/ui/text-field";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const authLandingSchema = authSchema.pick({
  email: true,
});

type AuthLandingSchema = z.infer<typeof authLandingSchema>;

const useAuthLanding = () =>
  useAuthStore(
    useShallow(({ setData, setStep }) => ({
      setData,
      setStep,
    })),
  );

export const Landing = () => {
  const { setStep, setData } = useAuthLanding();

  const { mutateAsync: getUserAndAccountByEmailAsync, isPending } =
    useProtectedMutation({
      requireAuth: false,
      schema: GetUserAndAccountByEmailSchema,
      mutationFn: getUserAndAccountByEmail,
      onError: () => {
        toast.error("Something went wrong! Please try again.");
      },
    });

  const form = useForm<z.infer<typeof authLandingSchema>>({
    resolver: zodResolver(authLandingSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: AuthLandingSchema) => {
    const { email } = values;
    const { account, user } = await getUserAndAccountByEmailAsync({
      email,
    });

    setData({ email });

    if (account) {
      signIn(account.provider, {
        redirectTo: "/portal/dashboard",
      });
      return;
    }

    if (user) {
      setStep("ENTER_PASSWORD");
    } else {
      setStep("CREATE_PASSWORD");
    }
  };

  return (
    <FormWrapper
      header="Welcome to SmartCookie!"
      subHeader="Log in or register to get started."
    >
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState: { error, invalid } }) => (
            <TextField
              {...field}
              label="Email"
              autoFocus
              validationBehavior="aria"
              isInvalid={invalid}
              errorMessage={error?.message}
              isDisabled={isPending}
            />
          )}
        />

        <Button className="w-full mt-4" type="submit" isPending={isPending}>
          {isPending && (
            <ProgressCircle isIndeterminate aria-label="Loading..." />
          )}
          Continue
        </Button>
      </Form>
      <span className="my-6 block w-full text-center text-xs font-medium text-muted-foreground">
        OR
      </span>
      <div className="space-y-3">
        <SocialButton provider="google" />
      </div>
    </FormWrapper>
  );
};
