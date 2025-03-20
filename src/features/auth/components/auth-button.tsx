"use client";

import { type ButtonProps, Link, buttonStyles } from "@/shared/components/ui";
import { cn } from "@/shared/lib/classes";

type LoginButtonProps = {
  children: React.ReactNode;
  callbackUrl?: string;
  className?: string;
} & ButtonProps;

export const AuthButton = ({
  children,
  callbackUrl,
  className,
  ...props
}: LoginButtonProps) => {
  const href = `/login/${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`;

  return (
    <Link href={href} className={cn(buttonStyles({ ...props, className }))}>
      {children}
    </Link>
  );
};
