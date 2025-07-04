"use client";
import { signIn } from "next-auth/react";

import { useSearchParams } from "next/navigation";

import { DEFAULT_LOGIN_REDIRECT } from "@/core/config/app-config";
import { cn } from "@/shared/lib/classes";

import { Button } from "@/ui/button";
import { AppleIcon, GoogleIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

type Provider = "google" | "apple";

const socialButtonMapping: Record<
  Provider,
  {
    label: string;
    provider: Provider;
    icon: typeof GoogleIcon;
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
  // const { redirectTo } = useAuthSettingsContextConsumer();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = () => {
    const rTo = callbackUrl ?? DEFAULT_LOGIN_REDIRECT;
    signIn(provider, {
      callbackUrl: rTo,
    });
  };

  const { label, icon } = socialButtonMapping[provider];

  return (
    <Button
      intent="outline"
      className={cn(
        "flex w-full justify-between text-sm sm:text-md",
        className,
      )}
      type="button"
      onPress={onClick}
    >
      <HugeiconsIcon icon={icon} data-slot="icon" />
      <span className="block w-full text-center">{label}</span>
    </Button>
  );
};
