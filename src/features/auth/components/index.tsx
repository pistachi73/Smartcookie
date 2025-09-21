"use client";

import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { Link } from "@/shared/components/ui/link";
import { cn } from "@/shared/lib/classes";

import { useAuthStore } from "@/features/auth/store/auth-store-provider";
import { Landing } from "./landing";
import { ResetPassword } from "./reset-password";
import { UpdatePassword } from "./update-password";

const DynamicCreatePassword = dynamic(() =>
  import("./create-password").then((mod) => mod.CreatePassword),
);
const DynamicEmailVerification = dynamic(() =>
  import("./email-verification").then((mod) => mod.EmailVerification),
);
const DynamicEnterPassword = dynamic(() =>
  import("./enter-password").then((mod) => mod.EnterPassword),
);

const DynamicTwoFactor = dynamic(() =>
  import("./two-factor").then((mod) => mod.TwoFactor),
);

export const Auth = ({ className }: { className?: string }) => {
  const step = useAuthStore((store) => store.step);

  return (
    <div
      className={cn(
        "sm:max-w-4xl bg-overlay flex h-full w-full  flex-row overflow-hidden rounded-none p-0 sm:h-[800px] sm:max-h-[80vh]  sm:rounded-lg  shadow-xs border border-border",
        className,
      )}
    >
      <div className="relative hidden min-h-full w-full basis-1/2  bg-cover bg-left lg:block bg-primary/20">
        <Image
          src="/images/login-modal/modal-image.jpg"
          alt="SmartCookie"
          fill
          className="object-cover"
          sizes="300px"
        />
      </div>
      <div className="relative flex min-h-full flex-col justify-between gap-6 overflow-y-auto px-8 sm:px-10 py-8 lg:basis-1/2 w-full">
        <AnimatePresence initial={false} mode="wait">
          {step === "LANDING" && <Landing key={step} />}
          {step === "CREATE_PASSWORD" && <DynamicCreatePassword key={step} />}
          {step === "VERIFY_EMAIL" && <DynamicEmailVerification key={step} />}
          {step === "ENTER_PASSWORD" && <DynamicEnterPassword key={step} />}
          {step === "RESET_PASSWORD" && <ResetPassword key={step} />}
          {step === "UPDATE_PASSWORD" && <UpdatePassword key={step} />}
          {step === "TWO_FACTOR" && <DynamicTwoFactor key={step} />}
        </AnimatePresence>
        <p className="text-xs font-light leading-5 text-muted-foreground ">
          By joining, you agree to the SmartCookie{" "}
          <Link href="/terms-of-service" intent="primary">
            Terms of Service
          </Link>{" "}
          and to occasionally receive emails from us. Please read our{" "}
          <Link href="/privacy-policy" intent="primary">
            Privacy Policy
          </Link>{" "}
          to learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};
