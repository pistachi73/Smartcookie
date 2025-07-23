"use client";

import { AnimatePresence } from "motion/react";
import Image from "next/image";

import { cn } from "@/shared/lib/classes";

import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { CreatePassword } from "./create-password";
import { EmailVerification } from "./email-verification";
import { EnterPassword } from "./enter-password";
import { Landing } from "./landing";
import { ResetPassword } from "./reset-password";
import { TwoFactor } from "./two-factor";
import { UpdatePassword } from "./update-password";

export const Auth = ({ className }: { className?: string }) => {
  const step = useAuthStore((store) => store.step);

  return (
    <div
      className={cn(
        "bg-overlay flex h-full w-full  flex-row overflow-hidden rounded-none p-0 sm:h-[800px] sm:max-h-[80vh] sm:w-[475px] sm:rounded-lg lg:w-[900px] shadow-xs border border-border",
        className,
      )}
    >
      <div className="relative hidden min-h-full w-full basis-1/2  bg-cover bg-left lg:block bg-primary/20">
        <Image
          src="/login.jpg"
          alt="SmartNotes"
          fill
          className="object-cover"
          sizes="300px"
        />
      </div>
      <div className="relative flex min-h-full flex-col justify-between gap-6 overflow-y-auto px-8 sm:px-10 py-8 lg:basis-1/2 w-full">
        <AnimatePresence initial={false} mode="wait">
          {step === "LANDING" && <Landing key={step} />}
          {step === "CREATE_PASSWORD" && <CreatePassword key={step} />}
          {step === "VERIFY_EMAIL" && <EmailVerification key={step} />}
          {step === "ENTER_PASSWORD" && <EnterPassword key={step} />}
          {step === "RESET_PASSWORD" && <ResetPassword key={step} />}
          {step === "UPDATE_PASSWORD" && <UpdatePassword key={step} />}
          {step === "TWO_FACTOR" && <TwoFactor key={step} />}
        </AnimatePresence>
        <p className="text-xs font-light leading-5 text-muted-foreground ">
          By joining, you agree to the SmartCookie Terms of Service and to
          occasionally receive emails from us. Please read our Privacy Policy to
          learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};
