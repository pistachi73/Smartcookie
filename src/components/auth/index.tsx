"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/providers/auth-store-provider";
import { BadgeCheck } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { CreatePassword } from "./create-password";
import { EmailVerification } from "./email-verification";
import { EnterPassword } from "./enter-password";
import { Landing } from "./landing";
import { ResetPassword } from "./reset-password";
import { TwoFactor } from "./two-factor";
import { UpdatePassword } from "./update-password";

const checkPoints = [
  { content: "Point 1", key: "point1" },
  { content: "Point 2", key: "point2" },
  { content: "Point 3", key: "point3" },
  { content: "Point 4", key: "point4" },
];

export const Auth = ({ className }: { className?: string }) => {
  const step = useAuthStore((store) => store.step);

  console.log({ step });

  return (
    <div
      className={cn(
        "bg-overlay flex h-full w-full  flex-row overflow-hidden rounded-none p-0 sm:h-[800px] sm:max-h-[80vh] sm:w-[475px] sm:rounded-lg lg:w-[900px] shadow-xs border border-border",
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
                <p className="text-md">{content}</p>
              </li>
            ))}
          </ul>
        </div>
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
          By joining, you agree to the {"{Company Name}"} Terms of Service and
          to occasionally receive emails from us. Please read our Privacy Policy
          to learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};
