"use client";

import { Slot } from "@radix-ui/react-slot";
import { signOut } from "next-auth/react";

type LogoutButtonProps = {
  children: React.ReactNode;
  asChild?: boolean;
};

export const LogoutButton = ({ children, asChild }: LogoutButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return <Comp onClick={() => signOut({ redirectTo: "/" })}>{children}</Comp>;
};
