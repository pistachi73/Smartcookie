import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedFunction,
  vi,
} from "vitest";

// Mock NextAuth and related dependencies to prevent import issues

// Mock all the data access functions
vi.mock("@/data-access/accounts/mutations", () => ({
  linkOAuthAccount: vi.fn(),
}));

vi.mock("@/data-access/accounts/queries", () => ({
  getAccountByProviderAndUserId: vi.fn(),
}));

vi.mock("@/data-access/accounts/internal", () => ({
  getAccountByUserIdInternal: vi.fn(),
}));

vi.mock("@/data-access/two-factor-confirmation/mutations", () => ({
  deleteTwoFactorConfirmationByToken: vi.fn(),
}));

vi.mock("@/data-access/two-factor-confirmation/queries", () => ({
  getTwoFactorConirmationByUserId: vi.fn(),
}));

vi.mock("@/data-access/user/queries", () => ({
  getUserByEmail: vi.fn(),
}));

vi.mock("@/data-access/user/internal", () => ({
  getUserByIdInternal: vi.fn(),
}));

vi.mock("@/data-access/user/mutations", () => ({
  updateUser: vi.fn(),
}));

vi.mock("@/data-access/user-subscription/internal", () => ({
  getUserSubscriptionByUserIdInternal: vi.fn(),
}));

// Mock the database
vi.mock("@/db", () => ({
  db: {
    transaction: vi.fn(),
  },
}));

import type { Account as NextAuthAccount, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

import { createMockAccount } from "@/data-access/accounts/__mocks__";
import { getAccountByUserIdInternal } from "@/data-access/accounts/internal";
import { linkOAuthAccount } from "@/data-access/accounts/mutations";
import { getAccountByProviderAndUserId } from "@/data-access/accounts/queries";
import { deleteTwoFactorConfirmationByToken } from "@/data-access/two-factor-confirmation/mutations";
import { getTwoFactorConirmationByUserId } from "@/data-access/two-factor-confirmation/queries";
import { createMockUser } from "@/data-access/user/__mocks__";
import { getUserByIdInternal } from "@/data-access/user/internal";
import { updateUser } from "@/data-access/user/mutations";
import { getUserByEmail } from "@/data-access/user/queries";
import { createMockUserSubscription } from "@/data-access/user-subscription/__mocks__";
import { getUserSubscriptionByUserIdInternal } from "@/data-access/user-subscription/internal";
import { db } from "@/db";
import { jwtCallback, sessionCallback, signInCallback } from "../callbacks";

// Import the actual functions we want to test

const mockLinkOAuthAccount = linkOAuthAccount as MockedFunction<
  typeof linkOAuthAccount
>;
const mockGetAccountByUserIdInternal =
  getAccountByUserIdInternal as MockedFunction<
    typeof getAccountByUserIdInternal
  >;
const mockGetAccountByProviderAndUserId =
  getAccountByProviderAndUserId as MockedFunction<
    typeof getAccountByProviderAndUserId
  >;
const mockDeleteTwoFactorConfirmationByToken =
  deleteTwoFactorConfirmationByToken as MockedFunction<
    typeof deleteTwoFactorConfirmationByToken
  >;
const mockGetTwoFactorConirmationByUserId =
  getTwoFactorConirmationByUserId as MockedFunction<
    typeof getTwoFactorConirmationByUserId
  >;
const mockGetUserByEmail = getUserByEmail as MockedFunction<
  typeof getUserByEmail
>;
const mockGetUserByIdInternal = getUserByIdInternal as MockedFunction<
  typeof getUserByIdInternal
>;
const mockUpdateUser = updateUser as MockedFunction<typeof updateUser>;
const mockGetUserSubscriptionByUserIdInternal =
  getUserSubscriptionByUserIdInternal as MockedFunction<
    typeof getUserSubscriptionByUserIdInternal
  >;
const mockDbTransaction = db.transaction as MockedFunction<
  typeof db.transaction
>;

describe("signInCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock transaction to execute the callback immediately
    mockDbTransaction.mockImplementation(async (callback) => {
      return await callback({} as any);
    });
  });

  describe("Input validation", () => {
    it("should return false when user has no id", async () => {
      const user = { email: "test@example.com" };
      const account = null;

      const result = await signInCallback({ user, account });

      expect(result).toBe(false);
    });

    it("should return false when user has no email", async () => {
      const user = { id: "user-123" };
      const account = null;

      const result = await signInCallback({ user, account });

      expect(result).toBe(false);
    });

    it("should return false when user has neither id nor email", async () => {
      const user = { name: "John Doe" };
      const account = null;

      const result = await signInCallback({ user, account });

      expect(result).toBe(false);
    });
  });

  describe("OAuth flow", () => {
    const mockUser = createMockUser({
      id: "user-123",
      email: "test@example.com",
      name: "John Doe",
      image: "https://example.com/avatar.jpg",
    });

    it("should return true for new OAuth user when no existing user found", async () => {
      const account = {
        provider: "google",
        type: "oauth",
        providerAccountId: "google-123",
      } as NextAuthAccount;

      mockGetUserByEmail.mockResolvedValue(undefined);

      const result = await signInCallback({ user: mockUser, account });

      expect(result).toBe(true);
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });

    it("should return true when existing user already has this specific OAuth provider account", async () => {
      const account = {
        provider: "google",
        type: "oauth",
        providerAccountId: "google-123",
      } as NextAuthAccount;

      const existingUser = createMockUser({
        id: "existing-user-123",
        email: "test@example.com",
        name: "John Doe",
      });

      const existingAccount = createMockAccount({
        userId: "existing-user-123",
        provider: "google",
        providerAccountId: "google-123",
      });

      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGetAccountByProviderAndUserId.mockResolvedValue(existingAccount);

      const result = await signInCallback({ user: mockUser, account });

      expect(result).toBe(true);
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockGetAccountByProviderAndUserId).toHaveBeenCalledWith({
        userId: "existing-user-123",
        provider: "google",
        providerAccountId: "google-123",
      });
    });

    it("should link new OAuth provider to existing user who has different provider", async () => {
      const account = {
        provider: "github",
        type: "oauth",
        providerAccountId: "github-456",
        refresh_token: "refresh-token",
        access_token: "access-token",
        expires_at: 1234567890,
        token_type: "bearer",
        scope: "profile email",
        id_token: "id-token",
        session_state: "session-state",
      } as NextAuthAccount;

      const existingUser = createMockUser({
        id: "existing-user-123",
        email: "test@example.com",
        name: "Jane Doe",
        image: null,
        emailVerified: null,
      });

      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGetAccountByProviderAndUserId.mockResolvedValue(undefined);
      mockLinkOAuthAccount.mockResolvedValue(createMockAccount());
      mockUpdateUser.mockResolvedValue(existingUser);

      const result = await signInCallback({ user: mockUser, account });

      expect(result).toBe(true);

      expect(mockDbTransaction).toHaveBeenCalledWith(expect.any(Function));

      expect(mockLinkOAuthAccount).toHaveBeenCalledWith({
        trx: {},
        data: {
          userId: "existing-user-123",
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      });

      expect(mockUpdateUser).toHaveBeenCalledWith({
        trx: {},
        id: "existing-user-123",
        data: {
          name: mockUser.name,
          image: mockUser.image,
          emailVerified: expect.any(Date),
        },
      });
    });

    it("should preserve existing email verification when linking OAuth account", async () => {
      const account = {
        provider: "google",
        type: "oauth",
        providerAccountId: "google-123",
        refresh_token: "refresh-token",
        access_token: "access-token",
      } as NextAuthAccount;

      const existingUser = createMockUser({
        id: "existing-user-123",
        email: "test@example.com",
        name: "Jane Doe",
        emailVerified: new Date("2023-01-01"),
      });

      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGetAccountByProviderAndUserId.mockResolvedValue(undefined);
      mockLinkOAuthAccount.mockResolvedValue(createMockAccount());
      mockUpdateUser.mockResolvedValue(existingUser);

      const result = await signInCallback({ user: mockUser, account });

      expect(result).toBe(true);
      expect(mockUpdateUser).toHaveBeenCalledWith({
        trx: {},
        id: "existing-user-123",
        data: {
          name: mockUser.name,
          image: mockUser.image,
          emailVerified: new Date("2023-01-01"),
        },
      });
    });

    it("should prefer existing user data over OAuth data when linking", async () => {
      const account = {
        provider: "google",
        type: "oauth",
        providerAccountId: "google-123",
        refresh_token: "refresh-token",
        access_token: "access-token",
      } as NextAuthAccount;

      const existingUser = createMockUser({
        id: "existing-user-123",
        email: "test@example.com",
        name: "Existing Name",
        image: "https://existing.com/avatar.jpg",
      });

      const oauthUser = {
        id: "oauth-user-123",
        email: "test@example.com",
        name: "OAuth Name",
        image: "https://oauth.com/avatar.jpg",
      };

      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGetAccountByProviderAndUserId.mockResolvedValue(undefined);
      mockLinkOAuthAccount.mockResolvedValue(createMockAccount());
      mockUpdateUser.mockResolvedValue(existingUser);

      const result = await signInCallback({ user: oauthUser, account });

      expect(result).toBe(true);
      expect(mockUpdateUser).toHaveBeenCalledWith({
        trx: {},
        id: "existing-user-123",
        data: {
          name: "OAuth Name",
          image: "https://oauth.com/avatar.jpg",
          emailVerified: expect.any(Date),
        },
      });
    });
  });

  describe("Credentials flow", () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      name: "John Doe",
    };

    it("should return false when user not found in database", async () => {
      mockGetUserByEmail.mockResolvedValue(undefined);

      const result = await signInCallback({
        user: mockUser,
        account: null,
      });

      expect(result).toBe(false);
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });

    it("should return true when user exists and two-factor is disabled", async () => {
      const existingUser = createMockUser({
        id: "user-123",
        email: "test@example.com",
        name: "John Doe",
        isTwoFactorEnabled: false,
        emailVerified: new Date(),
      });

      mockGetUserByEmail.mockResolvedValue(existingUser);

      const result = await signInCallback({
        user: mockUser,
        account: null,
      });

      expect(result).toBe(true);
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });

    it("should return false when two-factor is enabled but no confirmation found", async () => {
      const existingUser = createMockUser({
        id: "user-123",
        email: "test@example.com",
        name: "John Doe",
        isTwoFactorEnabled: true,
        emailVerified: new Date(),
      });

      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGetTwoFactorConirmationByUserId.mockResolvedValue(undefined);

      const result = await signInCallback({
        user: mockUser,
        account: null,
      });

      expect(result).toBe(false);
      expect(mockGetTwoFactorConirmationByUserId).toHaveBeenCalledWith({
        userId: "user-123",
      });
    });

    it("should return true and delete confirmation when two-factor is enabled and confirmation exists", async () => {
      const existingUser = createMockUser({
        id: "user-123",
        email: "test@example.com",
        name: "John Doe",
        isTwoFactorEnabled: true,
        emailVerified: new Date(),
      });

      const twoFactorConfirmation = {
        id: 1,
        token: "confirmation-token-123",
        userId: "user-123",
      };

      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGetTwoFactorConirmationByUserId.mockResolvedValue(
        twoFactorConfirmation,
      );
      mockDeleteTwoFactorConfirmationByToken.mockResolvedValue(undefined);

      const result = await signInCallback({
        user: mockUser,
        account: null,
      });

      expect(result).toBe(true);
      expect(mockGetTwoFactorConirmationByUserId).toHaveBeenCalledWith({
        userId: "user-123",
      });
      expect(mockDeleteTwoFactorConfirmationByToken).toHaveBeenCalledWith({
        token: twoFactorConfirmation.token,
      });
    });
  });

  describe("Mixed OAuth and Credentials scenarios", () => {
    it("should handle user with existing credentials trying OAuth sign in", async () => {
      const account = {
        provider: "google",
        type: "oauth",
        providerAccountId: "google-123",
        refresh_token: "refresh-token",
        access_token: "access-token",
      } as NextAuthAccount;

      const existingUser = createMockUser({
        id: "existing-user-123",
        email: "test@example.com",
        name: "John Doe",
        password: "hashed-password",
        emailVerified: new Date(),
      });

      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGetAccountByProviderAndUserId.mockResolvedValue(undefined);
      mockLinkOAuthAccount.mockResolvedValue(createMockAccount());
      mockUpdateUser.mockResolvedValue(existingUser);

      const result = await signInCallback({
        user: { id: "oauth-user", email: "test@example.com", name: "John Doe" },
        account,
      });

      expect(result).toBe(true);
      expect(mockLinkOAuthAccount).toHaveBeenCalled();
      expect(mockUpdateUser).toHaveBeenCalledWith({
        trx: {},
        id: "existing-user-123",
        data: {
          name: "John Doe",
          image: null,
          emailVerified: new Date(existingUser.emailVerified!),
        },
      });
    });

    it("should handle user with multiple OAuth providers", async () => {
      const account = {
        provider: "github",
        type: "oauth",
        providerAccountId: "github-456",
        refresh_token: "refresh-token",
        access_token: "access-token",
      } as NextAuthAccount;

      const existingUser = createMockUser({
        id: "existing-user-123",
        email: "test@example.com",
        name: "John Doe",
      });

      // User already has Google account, now adding GitHub
      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGetAccountByProviderAndUserId.mockResolvedValue(undefined);
      mockLinkOAuthAccount.mockResolvedValue(createMockAccount());
      mockUpdateUser.mockResolvedValue(existingUser);

      const result = await signInCallback({
        user: {
          id: "github-user",
          email: "test@example.com",
          name: "John Doe",
        },
        account,
      });

      expect(result).toBe(true);
      expect(mockGetAccountByProviderAndUserId).toHaveBeenCalledWith({
        userId: "existing-user-123",
        provider: "github",
        providerAccountId: "github-456",
      });
      expect(mockLinkOAuthAccount).toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    beforeEach(() => {
      consoleSpy.mockClear();
    });

    const errorTestCases = [
      {
        name: "getUserByEmail throws in OAuth flow",
        mockUser: {
          id: "user-123",
          email: "test@example.com",
          name: "John Doe",
        },
        account: {
          provider: "google",
          type: "oauth",
          providerAccountId: "google-123",
        } as NextAuthAccount,
        error: new Error("Database connection failed"),
        setup: () => {
          mockGetUserByEmail.mockRejectedValue(
            new Error("Database connection failed"),
          );
        },
      },
      {
        name: "getAccountByProviderAndUserId throws",
        mockUser: {
          id: "user-123",
          email: "test@example.com",
          name: "John Doe",
        },
        account: {
          provider: "google",
          type: "oauth",
          providerAccountId: "google-123",
        } as NextAuthAccount,
        error: new Error("Account query failed"),
        setup: () => {
          const existingUser = createMockUser({
            id: "existing-user-123",
            email: "test@example.com",
            name: "Jane Doe",
          });
          mockGetUserByEmail.mockResolvedValue(existingUser);
          mockGetAccountByProviderAndUserId.mockRejectedValue(
            new Error("Account query failed"),
          );
        },
      },
      {
        name: "database transaction fails",
        mockUser: {
          id: "user-123",
          email: "test@example.com",
          name: "John Doe",
        },
        account: {
          provider: "google",
          type: "oauth",
          providerAccountId: "google-123",
          refresh_token: "refresh-token",
          access_token: "access-token",
        } as NextAuthAccount,
        error: new Error("Transaction failed"),
        setup: () => {
          const existingUser = createMockUser({
            id: "existing-user-123",
            email: "test@example.com",
            name: "Jane Doe",
          });
          mockGetUserByEmail.mockResolvedValue(existingUser);
          mockGetAccountByProviderAndUserId.mockResolvedValue(undefined);
          mockDbTransaction.mockRejectedValue(new Error("Transaction failed"));
        },
      },
      {
        name: "linkOAuthAccount throws inside transaction",
        mockUser: {
          id: "user-123",
          email: "test@example.com",
          name: "John Doe",
        },
        account: {
          provider: "google",
          type: "oauth",
          providerAccountId: "google-123",
          refresh_token: "refresh-token",
          access_token: "access-token",
        } as NextAuthAccount,
        error: new Error("Failed to link OAuth account"),
        setup: () => {
          const existingUser = createMockUser({
            id: "existing-user-123",
            email: "test@example.com",
            name: "Jane Doe",
          });
          mockGetUserByEmail.mockResolvedValue(existingUser);
          mockGetAccountByProviderAndUserId.mockResolvedValue(undefined);
          mockLinkOAuthAccount.mockRejectedValue(
            new Error("Failed to link OAuth account"),
          );
          mockDbTransaction.mockImplementation(async (callback) => {
            await callback({} as any);
          });
        },
      },
      {
        name: "getTwoFactorConirmationByUserId throws",
        mockUser: { id: "user-123", email: "test@example.com" },
        account: null,
        error: new Error("Two-factor query failed"),
        setup: () => {
          const existingUser = createMockUser({
            id: "user-123",
            email: "test@example.com",
            name: "John Doe",
            isTwoFactorEnabled: true,
          });
          mockGetUserByEmail.mockResolvedValue(existingUser);
          mockGetTwoFactorConirmationByUserId.mockRejectedValue(
            new Error("Two-factor query failed"),
          );
        },
      },
      {
        name: "deleteTwoFactorConfirmationByToken throws",
        mockUser: { id: "user-123", email: "test@example.com" },
        account: null,
        error: new Error("Failed to delete two-factor confirmation"),
        setup: () => {
          const existingUser = createMockUser({
            id: "user-123",
            email: "test@example.com",
            name: "John Doe",
            isTwoFactorEnabled: true,
          });
          const twoFactorConfirmation = {
            id: 1,
            token: "confirmation-token-123",
            userId: "user-123",
          };
          mockGetUserByEmail.mockResolvedValue(existingUser);
          mockGetTwoFactorConirmationByUserId.mockResolvedValue(
            twoFactorConfirmation,
          );
          mockDeleteTwoFactorConfirmationByToken.mockRejectedValue(
            new Error("Failed to delete two-factor confirmation"),
          );
        },
      },
      {
        name: "unexpected runtime errors",
        mockUser: { id: "user-123", email: "test@example.com" },
        account: null,
        error: "Unexpected string error",
        setup: () => {
          mockGetUserByEmail.mockImplementation(() => {
            throw "Unexpected string error";
          });
        },
      },
    ];

    it.each(errorTestCases)(
      "should return false and log error when $name",
      async ({ mockUser, account, error, setup }) => {
        setup();

        const result = await signInCallback({ user: mockUser, account });

        expect(result).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith(
          "Error in signInCallback:",
          error,
        );
      },
    );
  });
});

describe("jwtCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return token unchanged when no sub is present", async () => {
    const token = { name: "John Doe" } as JWT;

    const result = await jwtCallback({ token });

    expect(result).toEqual(token);
    expect(mockGetUserByIdInternal).not.toHaveBeenCalled();
    expect(mockGetAccountByUserIdInternal).not.toHaveBeenCalled();
    expect(mockGetUserSubscriptionByUserIdInternal).not.toHaveBeenCalled();
  });

  it("should return token unchanged when user not found", async () => {
    const token = { sub: "user-123" } as JWT;

    mockGetUserByIdInternal.mockResolvedValue(undefined);

    const result = await jwtCallback({ token });

    expect(result).toEqual(token);
    expect(mockGetUserByIdInternal).toHaveBeenCalledWith(token.sub);
    expect(mockGetAccountByUserIdInternal).not.toHaveBeenCalled();
    expect(mockGetUserSubscriptionByUserIdInternal).not.toHaveBeenCalled();
  });

  it("should update token with user data when user exists without OAuth account or subscription", async () => {
    const token = { sub: "user-123", oldProp: "should-remain" };

    const user = createMockUser({
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      role: "USER",
      isTwoFactorEnabled: true,
      stripeCustomerId: "cus_123",
    });

    mockGetUserByIdInternal.mockResolvedValue(user);
    mockGetAccountByUserIdInternal.mockResolvedValue(undefined);
    mockGetUserSubscriptionByUserIdInternal.mockResolvedValue(undefined);

    const result = await jwtCallback({ token: token as any });

    expect(result).toEqual({
      sub: "user-123",
      oldProp: "should-remain",
      isOAuth: false,
      name: "John Doe",
      email: "john@example.com",
      role: "USER",
      isTwoFactorEnabled: true,
      stripeCustomerId: "cus_123",
      subscriptionTier: "free",
      subscriptionStatus: undefined,
    });
    expect(mockGetUserByIdInternal).toHaveBeenCalledWith(token.sub);
    expect(mockGetAccountByUserIdInternal).toHaveBeenCalledWith(token.sub);
    expect(mockGetUserSubscriptionByUserIdInternal).toHaveBeenCalledWith(
      token.sub,
    );
  });

  it("should update token with user data when user exists with OAuth account", async () => {
    const token = { sub: "user-123" } as JWT;

    const user = createMockUser({
      id: "user-123",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "ADMIN",
      isTwoFactorEnabled: false,
      stripeCustomerId: "cus_456",
    });

    const account = createMockAccount({
      userId: "user-123",
      provider: "google",
      providerAccountId: "google-123",
    });

    mockGetUserByIdInternal.mockResolvedValue(user);
    mockGetAccountByUserIdInternal.mockResolvedValue(account);
    mockGetUserSubscriptionByUserIdInternal.mockResolvedValue(undefined);

    const result = await jwtCallback({ token });

    expect(result).toEqual({
      sub: "user-123",
      isOAuth: true,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "ADMIN",
      isTwoFactorEnabled: false,
      stripeCustomerId: "cus_456",
      subscriptionTier: "free",
      subscriptionStatus: undefined,
    });
  });

  describe("Subscription scenarios", () => {
    it("should include active pro subscription data", async () => {
      const token = { sub: "user-123" } as JWT;

      const user = createMockUser({
        id: "user-123",
        name: "Pro User",
        email: "pro@example.com",
        role: "USER",
        isTwoFactorEnabled: false,
        stripeCustomerId: "cus_pro",
      });

      const subscription = createMockUserSubscription({
        userId: "user-123",
        status: "active",
        tier: "premium",
      });

      mockGetUserByIdInternal.mockResolvedValue(user);
      mockGetAccountByUserIdInternal.mockResolvedValue(undefined);
      mockGetUserSubscriptionByUserIdInternal.mockResolvedValue(subscription);

      const result = await jwtCallback({ token });

      expect(result).toEqual({
        sub: "user-123",
        isOAuth: false,
        name: "Pro User",
        email: "pro@example.com",
        role: "USER",
        isTwoFactorEnabled: false,
        stripeCustomerId: "cus_pro",
        subscriptionTier: "premium",
        subscriptionStatus: "active",
      });
    });

    it("should include inactive subscription data", async () => {
      const token = { sub: "user-123" } as JWT;

      const user = createMockUser({
        id: "user-123",
        name: "Inactive User",
        email: "inactive@example.com",
        role: "USER",
        stripeCustomerId: "cus_inactive",
      });

      const subscription = createMockUserSubscription({
        userId: "user-123",
        status: "inactive",
        tier: "premium",
      });

      mockGetUserByIdInternal.mockResolvedValue(user);
      mockGetAccountByUserIdInternal.mockResolvedValue(undefined);
      mockGetUserSubscriptionByUserIdInternal.mockResolvedValue(subscription);

      const result = await jwtCallback({ token });

      expect(result).toEqual({
        sub: "user-123",
        isOAuth: false,
        name: "Inactive User",
        email: "inactive@example.com",
        role: "USER",
        isTwoFactorEnabled: false,
        stripeCustomerId: "cus_inactive",
        subscriptionTier: "premium",
        subscriptionStatus: "inactive",
      });
    });

    it("should handle user with OAuth account and active subscription", async () => {
      const token = { sub: "user-123" } as JWT;

      const user = createMockUser({
        id: "user-123",
        name: "OAuth Pro User",
        email: "oauth.pro@example.com",
        role: "USER",
        isTwoFactorEnabled: false,
        stripeCustomerId: "cus_oauth_pro",
      });

      const account = createMockAccount({
        userId: "user-123",
        provider: "github",
        providerAccountId: "github-456",
      });

      const subscription = createMockUserSubscription({
        userId: "user-123",
        status: "active",
        tier: "premium",
      });

      mockGetUserByIdInternal.mockResolvedValue(user);
      mockGetAccountByUserIdInternal.mockResolvedValue(account);
      mockGetUserSubscriptionByUserIdInternal.mockResolvedValue(subscription);

      const result = await jwtCallback({ token });

      expect(result).toEqual({
        sub: "user-123",
        isOAuth: true,
        name: "OAuth Pro User",
        email: "oauth.pro@example.com",
        role: "USER",
        isTwoFactorEnabled: false,
        stripeCustomerId: "cus_oauth_pro",
        subscriptionTier: "premium",
        subscriptionStatus: "active",
      });
    });

    it("should handle user without stripeCustomerId", async () => {
      const token = { sub: "user-123" } as JWT;

      const user = createMockUser({
        id: "user-123",
        name: "No Stripe User",
        email: "nostripe@example.com",
        role: "USER",
        stripeCustomerId: null,
      });

      mockGetUserByIdInternal.mockResolvedValue(user);
      mockGetAccountByUserIdInternal.mockResolvedValue(undefined);
      mockGetUserSubscriptionByUserIdInternal.mockResolvedValue(undefined);

      const result = await jwtCallback({ token });

      expect(result).toEqual({
        sub: "user-123",
        isOAuth: false,
        name: "No Stripe User",
        email: "nostripe@example.com",
        role: "USER",
        isTwoFactorEnabled: false,
        stripeCustomerId: null,
        subscriptionTier: "free",
        subscriptionStatus: undefined,
      });
    });
  });
});

describe("sessionCallback", () => {
  it("should update session with token data when session.user exists", async () => {
    const token = {
      sub: "user-123",
      name: "John Doe",
      email: "john@example.com",
      role: "ADMIN",
      isTwoFactorEnabled: true,
      isOAuth: false,
      stripeCustomerId: "cus_123",
      subscriptionTier: "basic",
      subscriptionStatus: "active",
    } as JWT;

    const session = {
      user: {},
      expires: "2024-12-31T23:59:59.999Z",
    } as Session;

    const result = await sessionCallback({ token, session });

    expect(result).toEqual({
      user: {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        role: "ADMIN",
        isTwoFactorEnabled: true,
        isOAuth: false,
        stripeCustomerId: "cus_123",
        subscriptionTier: "basic",
        hasActiveSubscription: true,
      },
      expires: "2024-12-31T23:59:59.999Z",
    });
  });

  it("should return session unchanged when session.user does not exist", async () => {
    const token = {
      sub: "user-123",
      name: "John Doe",
      email: "john@example.com",
      stripeCustomerId: "cus_123",
      subscriptionTier: "basic",
      subscriptionStatus: "active",
    } as JWT;

    const session = {
      expires: "2024-12-31T23:59:59.999Z",
    } as Session;

    const result = await sessionCallback({ token, session });

    expect(result).toEqual({
      expires: "2024-12-31T23:59:59.999Z",
    });
  });

  describe("Subscription status mapping", () => {
    it("should set hasActiveSubscription to true when subscription status is active", async () => {
      const token = {
        sub: "user-123",
        name: "Pro User",
        email: "pro@example.com",
        role: "USER",
        isTwoFactorEnabled: false,
        isOAuth: false,
        stripeCustomerId: "cus_pro",
        subscriptionTier: "basic",
        subscriptionStatus: "active",
      } as JWT;

      const session = {
        user: {},
        expires: "2024-12-31T23:59:59.999Z",
      } as Session;

      const result = await sessionCallback({ token, session });

      expect(result.user?.hasActiveSubscription).toBe(true);
    });

    it("should set hasActiveSubscription to false when subscription status is inactive", async () => {
      const token = {
        sub: "user-123",
        name: "Inactive User",
        email: "inactive@example.com",
        role: "USER",
        isTwoFactorEnabled: false,
        isOAuth: false,
        stripeCustomerId: "cus_inactive",
        subscriptionTier: "basic",
        subscriptionStatus: "inactive",
      } as JWT;

      const session = {
        user: {},
        expires: "2024-12-31T23:59:59.999Z",
      } as Session;

      const result = await sessionCallback({ token, session });

      expect(result.user?.hasActiveSubscription).toBe(false);
    });

    it("should set hasActiveSubscription to false when subscription status is undefined", async () => {
      const token = {
        sub: "user-123",
        name: "Free User",
        email: "free@example.com",
        role: "USER",
        isTwoFactorEnabled: false,
        isOAuth: false,
        stripeCustomerId: "cus_free",
        subscriptionTier: "free",
        subscriptionStatus: undefined,
      } as JWT;

      const session = {
        user: {},
        expires: "2024-12-31T23:59:59.999Z",
      } as Session;

      const result = await sessionCallback({ token, session });

      expect(result.user?.hasActiveSubscription).toBe(false);
    });

    it("should handle user without stripeCustomerId", async () => {
      const token = {
        sub: "user-123",
        name: "No Stripe User",
        email: "nostripe@example.com",
        role: "USER",
        isTwoFactorEnabled: false,
        isOAuth: false,
        stripeCustomerId: null,
        subscriptionTier: "free",
        subscriptionStatus: undefined,
      } as JWT;

      const session = {
        user: {},
        expires: "2024-12-31T23:59:59.999Z",
      } as Session;

      const result = await sessionCallback({ token, session });

      expect(result).toEqual({
        user: {
          id: "user-123",
          name: "No Stripe User",
          email: "nostripe@example.com",
          role: "USER",
          isTwoFactorEnabled: false,
          isOAuth: false,
          stripeCustomerId: null,
          subscriptionTier: "free",
          hasActiveSubscription: false,
        },
        expires: "2024-12-31T23:59:59.999Z",
      });
    });
  });
});
