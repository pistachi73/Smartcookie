"use client";
import { signIn } from "next-auth/react";

import { useSearchParams } from "next/navigation";

import { DEFAULT_LOGIN_REDIRECT } from "@/core/config/app-config";
import { cn } from "@/shared/lib/classes";

import { Button } from "@/shared/components/ui";
import { AppleIcon, GoogleIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import type { JSX } from "react";

type Provider = "google" | "apple";

const socialButtonMapping: Record<
  Provider,
  {
    label: string;
    provider: Provider;
    icon: JSX.Element;
  }
> = {
  google: {
    label: "Continue with google",
    provider: "google",
    icon: <HugeiconsIcon icon={GoogleIcon} size={24} />,
  },
  apple: {
    label: "Continue with Apple",
    provider: "apple",
    icon: <HugeiconsIcon icon={AppleIcon} size={24} />,
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
      appearance="outline"
      className={cn(
        "flex w-full justify-between border text-sm sm:text-md",
        className,
      )}
      type="button"
      onPress={onClick}
    >
      {icon}
      <span className="block w-full text-center">{label}</span>
    </Button>
  );
};
