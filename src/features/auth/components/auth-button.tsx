"use client";

import { type ButtonProps, buttonStyles } from "@/ui/button";
import { Link } from "@/ui/link";
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
