"use client";
import { signIn } from "next-auth/react";

import { useSearchParams } from "next/navigation";

import { DEFAULT_LOGIN_REDIRECT } from "@/app-config";
import { Button } from "@/components/ui/button";
import { AppleIcon } from "@/components/ui/icons/apple-icon";
import { GoogleIcon } from "@/components/ui/icons/google-icon";
import { cn } from "@/lib/utils";
import { useAuthSettingsContextConsumer } from "./auth-settings-context";

import type { JSX } from "react";

type Provider = "google" | "apple";

const socialButtonMapping: Record<
  Provider,
  {
    label: string;
    provider: Provider;
    icon: ({ className }: { className: string }) => JSX.Element;
  }
> = {
  google: {
    label: "Continue with google",
    provider: "google",
    icon: GoogleIcon,
  },
  apple: {
    label: "Continue with Apple",
    provider: "apple",
    icon: AppleIcon,
  },
};

type SocialButtonProps = {
  provider: Provider;
  className?: string;
};

export const SocialButton = ({ provider, className }: SocialButtonProps) => {
  const { redirectTo } = useAuthSettingsContextConsumer();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = () => {
    const rTo = callbackUrl ?? redirectTo ?? DEFAULT_LOGIN_REDIRECT;
    signIn(provider, {
      callbackUrl: rTo,
    });
  };

  const { label, icon: Icon } = socialButtonMapping[provider];

  return (
    <Button
      size="lg"
      variant="outline"
      className={cn(
        "flex w-full justify-between border text-sm sm:text-base",
        className,
      )}
      type="button"
      onClick={onClick}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px]",
          provider === "apple" && "fill-foreground",
        )}
      />
      <span className="block w-full text-center">{label}</span>
    </Button>
  );
};
