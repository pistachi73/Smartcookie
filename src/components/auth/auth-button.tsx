"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { useRouter } from "next/navigation";

type LoginButtonProps = {
  children: React.ReactNode;
  callbackUrl?: string;
  asChild?: boolean;
  className?: string;
};

export const AuthButton = ({
  children,
  callbackUrl,
  asChild,
  className,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    const href = `/login/${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`;
    router.push(href);
  };

  const Comp = asChild ? Slot : "button";

  return (
    <Comp onClick={onClick} className={cn(className)}>
      {children}
    </Comp>
  );
};
