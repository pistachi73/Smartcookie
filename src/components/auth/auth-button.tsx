"use client";

import { cn } from "@/lib/utils";
import { Link } from "react-aria-components";
import { type ButtonProps, buttonStyles } from "../ui";

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
