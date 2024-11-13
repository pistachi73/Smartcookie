"use client";
import { signIn } from "next-auth/react";

import { useSearchParams } from "next/navigation";

import { DEFAULT_LOGIN_REDIRECT } from "@/app-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthSettingsContextConsumer } from "./auth-settings-context";

import { AppleIcon, GoogleIcon } from "@hugeicons/react";
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
    icon: <GoogleIcon size={24} variant="solid" />,
  },
  apple: {
    label: "Continue with Apple",
    provider: "apple",
    icon: <AppleIcon size={24} variant="solid" />,
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

  const { label, icon } = socialButtonMapping[provider];

  return (
    <Button
      size="default"
      variant="outline"
      className={cn(
        "flex w-full justify-between border text-sm sm:text-base",
        className,
      )}
      type="button"
      onClick={onClick}
    >
      {icon}
      <span className="block w-full text-center">{label}</span>
    </Button>
  );
};
