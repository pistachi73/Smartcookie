import "next-auth";
import type { DefaultSession } from "next-auth";
import "next-auth/jwt";

export type ExtendedUser = DefaultSession["user"] & {
  role: User["role"];
  isTwoFactorEnabled: User["isTwoFactorEnabled"];
  isOAuth: boolean;
  id: string;
  name: User["name"];
  email: User["email"];
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface User extends ExtendedUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    isOAuth: boolean;
    name: User["name"];
    email: User["email"];
    role: User["role"];
    isTwoFactorEnabled: User["isTwoFactorEnabled"];
  }
}
