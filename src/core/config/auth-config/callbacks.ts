import type { AdapterAccountType } from "@auth/core/adapters";
import type { Account, User as NextAuthUser, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

import { linkOAuthAccount } from "@/data-access/accounts/mutations";
import {
  getAccountByProviderAndUserId,
  getAccountByUserId,
} from "@/data-access/accounts/queries";
import { deleteTwoFactorConfirmationByToken } from "@/data-access/two-factor-confirmation/mutations";
import { getTwoFactorConirmationByUserId } from "@/data-access/two-factor-confirmation/queries";
import { updateUser } from "@/data-access/user/mutations";
import { getUserByEmail, getUserById } from "@/data-access/user/queries";
import { getUserSubscriptionByUserId } from "@/data-access/user-subscription/queries";
import { db } from "@/db";

export async function signInCallback(params: {
  user: NextAuthUser;
  account: Account | null;
}) {
  try {
    const { user, account } = params;

    // Early validation
    if (!user.id || !user.email) return false;

    const isOAuth = account && account.provider !== "credentials";

    const existingUser = await getUserByEmail({ email: user.email });
    if (isOAuth) {
      if (!existingUser) {
        // New OAuth user - allow sign up
        return true;
      }

      // Check if this specific provider account already exists
      const existingProviderAccount = await getAccountByProviderAndUserId({
        userId: existingUser.id,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });

      if (existingProviderAccount) {
        // Account already linked, proceed with sign in
        return true;
      }

      // Link new OAuth provider to existing user
      await db.transaction(async (trx) => {
        await Promise.all([
          linkOAuthAccount({
            trx,
            data: {
              userId: existingUser.id,
              type: account.type as AdapterAccountType,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token ?? null,
              access_token: account.access_token ?? null,
              expires_at: account.expires_at ?? null,
              token_type: account.token_type ?? null,
              scope: account.scope ?? null,
              id_token: account.id_token ?? null,
              session_state: (account.session_state as string) ?? null,
            },
          }),
          updateUser({
            trx,
            id: existingUser.id,
            data: {
              name: user.name || existingUser.name,
              image: user.image || existingUser.image,
              // Verify email for OAuth users if not already verified
              emailVerified: existingUser.emailVerified || new Date(),
            },
          }),
        ]);
      });

      return true;
    }

    if (!existingUser) return false;

    if (existingUser.isTwoFactorEnabled) {
      const twoFactorConfirmation = await getTwoFactorConirmationByUserId({
        userId: existingUser.id,
      });

      if (!twoFactorConfirmation) {
        console.log("Two-factor confirmation required");
        return false;
      }

      await deleteTwoFactorConfirmationByToken({
        token: twoFactorConfirmation.token,
      });
    }

    console.log("Credentials sign in successful");
    return true;
  } catch (error) {
    console.error("Error in signInCallback:", error);
    return false;
  }
}

export async function jwtCallback(params: { token: JWT }): Promise<JWT> {
  const { token } = params;

  if (!token.sub) {
    return token;
  }

  const user = await getUserById({ id: token.sub });

  if (!user) return token;

  const [existingAccount, userSubscription] = await Promise.all([
    getAccountByUserId({
      userId: user.id,
      columns: {
        provider: true,
      },
    }),
    getUserSubscriptionByUserId({
      userId: user.id,
      columns: {
        tier: true,
        status: true,
      },
    }),
  ]);

  return {
    ...token,
    isOAuth: !!existingAccount,
    name: user.name,
    email: user.email,
    role: user.role,
    isTwoFactorEnabled: user.isTwoFactorEnabled,
    stripeCustomerId: user.stripeCustomerId,
    subscriptionTier: userSubscription?.tier,
    subscriptionStatus: userSubscription?.status,
  };
}

export async function sessionCallback(params: {
  token: JWT;
  session: Session;
}): Promise<Session> {
  const { token, session } = params;

  if (session.user) {
    session.user.id = token.sub as string;
    session.user.role = token.role;
    session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.isOAuth = token.isOAuth;
    session.user.stripeCustomerId = token.stripeCustomerId;
    session.user.subscriptionTier = token.subscriptionTier;
    session.user.hasActiveSubscription = token.subscriptionStatus === "active";
  }

  return session;
}
