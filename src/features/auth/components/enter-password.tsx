import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { Link } from "@/ui/link";
import { ProgressCircle } from "@/ui/progress-circle";
import { TextField } from "@/ui/text-field";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { credentialsSignIn } from "@/data-access/auth/mutations";
import { CredentialsSignInSchema } from "@/data-access/auth/schemas";
import { isDataAccessError } from "@/data-access/errors";
import { useAuthStore } from "@/features/auth/store/auth-store-provider";
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

  const { mutate: credentialsSignInSync, isPending } = useProtectedMutation({
    requireAuth: false,
    schema: CredentialsSignInSchema,
    mutationFn: credentialsSignIn,
    onMutate: () => {
      console.log("onMutate");
    },
    onSuccess: (result) => {
      if (isDataAccessError(result)) {
        console.log({ result });
        switch (result.type) {
          case "INVALID_LOGIN":
            toast.error("Invalid email or password");
            form.setError("loginPassword", {
              message: "Invalid email or password",
            });
            break;
          default:
            toast.error("Something went wrong! Please try again.");
            break;
        }
        return;
      }

      if (result.twoFactor) {
        setStep("TWO_FACTOR");
      } else {
        onLoginSuccess();
        form.reset();
      }
    },
    onError: () => {
      toast.error("Something went wrong! Please try again.");
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
    credentialsSignInSync({ email, password: loginPassword });
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
          render={({ field: { ...rest }, fieldState: { error, invalid } }) => (
            <TextField
              {...rest}
              autoFocus
              isRevealable
              type="password"
              label="Password"
              isDisabled={isPending}
              errorMessage={error?.message}
              isInvalid={invalid}
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

        <Button className="w-full mt-4" type="submit" isPending={isPending}>
          {isPending && (
            <ProgressCircle isIndeterminate aria-label="Logging in..." />
          )}
          Login
        </Button>
      </Form>
    </FormWrapper>
  );
};
