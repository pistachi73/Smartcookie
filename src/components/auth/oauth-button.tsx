"use client";
import { signIn } from "next-auth/react";

import { useSearchParams } from "next/navigation";

import { DEFAULT_LOGIN_REDIRECT } from "@/app-config";
import { cn } from "@/lib/utils";
import { useAuthSettingsContextConsumer } from "./auth-settings-context";

import { AppleIcon, GoogleIcon } from "@hugeicons/react";
import type { JSX } from "react";
import { Button } from "../ui/new/ui";

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
