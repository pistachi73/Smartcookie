"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Form } from "../ui/form";
import { AuthProvider, useAuthContext } from "./auth-context";
import { CreatePassword } from "./create-password";
import { EmailVerification } from "./email-verification";
import { EnterPassword } from "./enter-password";
import { Landing } from "./landing";
import { ResetPassword } from "./reset-password";
import { TwoFactor } from "./two-factor";
import { UpdatePassword } from "./update-password";
import { AuthSchema } from "./validation";

const checkPoints = [
  { content: "Point 1", key: "point1" },
  { content: "Point 2", key: "point2" },
  { content: "Point 3", key: "point3" },
  { content: "Point 4", key: "point4" },
];

export type AuthSteps =
  | "LANDING"
  | "VERIFY_EMAIL"
  | "OAUTH"
  | "CREATE_PASSWORD"
  | "CONFIRM_PASSWORD"
  | "ENTER_PASSWORD"
  | "TWO_FACTOR"
  | "RESET_PASSWORD"
  | "UPDATE_PASSWORD";

type AuthForm = UseFormReturn<z.infer<typeof AuthSchema>>;

export type AuthFormSharedProps = {
  authForm: AuthForm;
};

export const AuthContent = ({ className }: { className?: string }) => {
  const { formType } = useAuthContext();
  const authForm: AuthForm = useForm<z.infer<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      registerPassword: "",
      registerPasswordConfirm: "",
      loginPassword: "",
      code: "",
    },
    mode: "onChange",
  });

  return (
    <div
      className={cn(
        " flex h-full w-full  flex-row overflow-hidden rounded-none p-0 sm:h-[800px] sm:max-h-[80vh] sm:w-[475px] sm:rounded-lg lg:w-[900px] shadow-xs border border-border",
        className,
      )}
    >
      <div className="relative hidden min-h-full w-full basis-1/2  bg-cover bg-left lg:block bg-primary/20">
        <div className="h-full p-10">
          <h3 className="text-balance py-6 text-xl sm:text-2xl font-semibold leading-tight tracking-tight">
            The only suscription you need.
          </h3>
          <ul className="space-y-4 py-4">
            {checkPoints.map(({ key, content }, index) => (
              <li key={key} className="flex items-start gap-2 text-lg">
                <div className="flex h-7 items-center justify-center ">
                  <BadgeCheck size={20} strokeWidth={2} />{" "}
                </div>
                <p className="text-base">{content}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative flex min-h-full flex-col justify-between gap-6 overflow-y-auto px-8 sm:px-10 py-8 lg:basis-1/2 bg-background w-full">
        <Form {...authForm}>
          <AnimatePresence initial={false} mode="wait">
            {formType === "LANDING" && (
              <Landing key={formType} authForm={authForm} />
            )}
            {formType === "CREATE_PASSWORD" && (
              <CreatePassword key={formType} authForm={authForm} />
            )}
            {formType === "VERIFY_EMAIL" && (
              <EmailVerification key={formType} authForm={authForm} />
            )}
            {formType === "ENTER_PASSWORD" && (
              <EnterPassword key={formType} authForm={authForm} />
            )}
            {formType === "RESET_PASSWORD" && (
              <ResetPassword key={formType} authForm={authForm} />
            )}
            {formType === "UPDATE_PASSWORD" && (
              <UpdatePassword key={formType} authForm={authForm} />
            )}
            {formType === "TWO_FACTOR" && (
              <TwoFactor key={formType} authForm={authForm} />
            )}
          </AnimatePresence>
        </Form>
        <p className="text-xs font-light leading-5 text-muted-foreground ">
          By joining, you agree to the {"{Company Name}"} Terms of Service and
          to occasionally receive emails from us. Please read our Privacy Policy
          to learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};

type AuthProps = {
  initialFormType?: AuthSteps;
  className?: string;
};
export const Auth = ({ initialFormType, className }: AuthProps) => {
  return (
    <AuthProvider initialFormType={initialFormType}>
      <AuthContent className={className} />
    </AuthProvider>
  );
};
