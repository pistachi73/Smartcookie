import { useAuthStore } from "@/providers/auth-store-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { getUserAndAccountByEmailAction } from "./actions";
import { FormWrapper } from "./form-wrapper";
import { SocialButton } from "./oauth-button";
import { authSchema } from "./validation";

import {
  Button,
  Form,
  ProgressCircle,
  TextField,
} from "@/components/ui/new/ui";

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
  const { executeAsync: getUserAndAccountByEmailAsync, isExecuting } =
    useAction(getUserAndAccountByEmailAction);

  const form = useForm<z.infer<typeof authLandingSchema>>({
    resolver: zodResolver(authLandingSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: AuthLandingSchema) => {
    const { email } = values;
    const result = await getUserAndAccountByEmailAsync(values.email);

    if (result?.data?.user && result.data.account) {
      return;
    }

    setData({ email });
    if (result?.data?.user) {
      setStep("ENTER_PASSWORD");
    } else {
      setStep("CREATE_PASSWORD");
    }
  };

  return (
    <FormWrapper
      header="Welcome to OH Subscription!"
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
              validationBehavior="aria"
              isInvalid={invalid}
              errorMessage={error?.message}
              isDisabled={isExecuting}
            />
          )}
        />

        <Button className="w-full mt-4" type="submit" isPending={isExecuting}>
          {isExecuting && (
            <ProgressCircle isIndeterminate aria-label="Creating..." />
          )}
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
