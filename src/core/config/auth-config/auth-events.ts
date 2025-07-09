import { createStripeCustomer } from "@/data-access/payment/mutations";
import type { User } from "next-auth";

export const createUser = async ({ user }: { user: User }) => {
  if (!user.email || !user.name || !user.id) {
    return;
  }
  await createStripeCustomer({
    email: user.email,
    name: user.name,
    userId: user.id,
  });
};
