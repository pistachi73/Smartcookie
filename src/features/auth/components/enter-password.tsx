import { useSafeAction } from "@/shared/hooks/use-safe-action";

import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import {
  Button,
  Form,
  Link,
  ProgressCircle,
  TextField,
} from "@/shared/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { signInAction } from "../actions";
import { useLoginSuccess } from "../hooks/use-login-success";
import { authSchema } from "../lib/validation";
import { FormWrapper } from "./form-wrapper";
const authEnterPassword = authSchema.pick({
  loginPassword: true,
});

type AuthEnterPassword = z.infer<typeof authEnterPassword>;

const useAuthEnterPassword = () =>
  useAuthStore(
    useShallow(({ data, setData, setStep }) => ({
      data,
      setStep,
      setData,
    })),
  );

export const EnterPassword = () => {
  const { setStep, data, setData } = useAuthEnterPassword();
  const onLoginSuccess = useLoginSuccess();

  const form = useForm<AuthEnterPassword>({
    resolver: zodResolver(authEnterPassword),
    defaultValues: {
      loginPassword: "",
    },
    mode: "onChange",
  });

  const { execute: signIn, isExecuting } = useSafeAction(signInAction, {
    onSuccess: ({ data }) => {
      if (data?.twoFactor) {
        setStep("TWO_FACTOR");
      } else {
        form.reset();
        onLoginSuccess();
      }
      console.log("login success");
    },
    onError: () => {
      // form.setError("loginPassword", { type: "informative" });
      form.setFocus("loginPassword", { shouldSelect: true });
    },
  });

  const onBack = () => {
    form.reset();
    setStep("LANDING");
  };

  const onSubmit = async (value: AuthEnterPassword) => {
    const { loginPassword } = value;
    const { email } = data;

    if (!email || !loginPassword) return;

    setData({ loginPassword });
    signIn({ email, password: loginPassword });
  };

  return (
    <FormWrapper
      header="Enter your password"
      backButton
      backButtonOnClick={onBack}
      className="space-y-6"
    >
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <input
          type="text"
          name="email"
          value={data.email}
          readOnly
          autoComplete="email"
          className="hidden"
        />
        <Controller
          control={form.control}
          name="loginPassword"
          render={({ field: { ...rest } }) => (
            <TextField
              {...rest}
              autoFocus
              isRevealable
              type="password"
              label="Password"
              validationBehavior="aria"
              isDisabled={isExecuting}
            />
          )}
        />

        <div className="w-full items-end flex justify-end mt-1">
          <Link
            intent="secondary"
            className="text-sm cursor-pointer"
            onPress={() => {
              setStep("RESET_PASSWORD");
            }}
          >
            Forgot password?
          </Link>
        </div>

        <Button className="w-full mt-4" type="submit" isPending={isExecuting}>
          {isExecuting && (
            <ProgressCircle isIndeterminate aria-label="Logging in..." />
          )}
          Login
        </Button>
      </Form>
    </FormWrapper>
  );
};
