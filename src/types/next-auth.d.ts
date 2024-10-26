import "next-auth";
import type { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: "ADMIN" | "USER";
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  id: string;
  name: string;
  email: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface User extends ExtendedUser {}
}
