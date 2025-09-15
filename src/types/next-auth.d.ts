import type { User, UserSubscription } from "@/db/schema";
import "next-auth";
import type { DefaultSession } from "next-auth";
import "next-auth/jwt";

export type AuthUser = DefaultSession["user"] & {
  role: User["role"];
  isTwoFactorEnabled: User["isTwoFactorEnabled"];
  isOAuth: boolean;
  id: string;
  name: User["name"];
  email: User["email"];
  stripeCustomerId: User["stripeCustomerId"];
  subscriptionTier?: UserSubscription["tier"] | "free";
  hasActiveSubscription: boolean;
};

declare module "next-auth" {
  interface Session {
    user: AuthUser;
  }

  interface User extends AuthUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    isOAuth: boolean;
    name: User["name"];
    email: User["email"];
    role: User["role"];
    isTwoFactorEnabled: User["isTwoFactorEnabled"];
    stripeCustomerId: User["stripeCustomerId"];
    subscriptionTier?: UserSubscription["tier"] | "free";
    subscriptionStatus?: UserSubscription["status"];
  }
}
