import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedFunction,
  vi,
} from "vitest";

// Mock NextAuth and related dependencies
vi.mock("@/core/config/auth-config", () => ({
  signIn: vi.fn(),
  auth: vi.fn(),
}));

vi.mock("@/data-access/utils", () => ({
  hashPassword: vi.fn(),
}));

vi.mock("@/data-access/user/queries", () => ({
  getUserByEmail: vi.fn(),
}));

vi.mock("@/data-access/two-factor-token/queries", () => ({
  getTwoFactorTokenByEmail: vi.fn(),
}));

vi.mock("@/data-access/two-factor-token/mutations", () => ({
  deleteTwoFactorTokenByToken: vi.fn(),
  sendTwoFactorEmail: vi.fn(),
}));

vi.mock("@/data-access/two-factor-confirmation/mutations", () => ({
  generateTwoFactorConfirmation: vi.fn(),
}));

vi.mock("@/shared/lib/mail", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("@/data-access/verification-token/mutations", () => ({
  sendEmailVerificationEmail: vi.fn(),
}));

vi.mock("@/data-access/password-reset-token/mutations", () => ({
  generatePasswordResetToken: vi.fn(),
  deletePasswordResetTokenByToken: vi.fn(),
}));

vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {
    type: string;
    constructor(message: string, type: string) {
      super(message);
      this.type = type;
    }
  },
}));

// Mock database imports to prevent environment variable access during module import
vi.mock("@/db", () => ({
  db: {},
}));

vi.mock("@/db/schema", () => ({
  user: {},
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

import { AuthError } from "next-auth";

import { signIn } from "@/core/config/auth-config";
import { createDataAccessError } from "@/data-access/errors";
import { createMockTwoFactorConfirmation } from "@/data-access/two-factor-confirmation/__tests__/__mocks__";
import { generateTwoFactorConfirmation } from "@/data-access/two-factor-confirmation/mutations";
import { createMockTwoFactorToken } from "@/data-access/two-factor-token/__tests__/__mocks__";
import {
  deleteTwoFactorTokenByToken,
  sendTwoFactorEmail,
} from "@/data-access/two-factor-token/mutations";
import { getTwoFactorTokenByEmail } from "@/data-access/two-factor-token/queries";
import { createMockUser } from "@/data-access/user/__mocks__";
import { getUserByEmail } from "@/data-access/user/queries";
import { hashPassword } from "@/data-access/utils";
import { credentialsSignIn } from "../mutations";

const mockSignIn = signIn as MockedFunction<typeof signIn>;
const mockHashPassword = hashPassword as MockedFunction<typeof hashPassword>;
const mockGetUserByEmail = getUserByEmail as MockedFunction<
  typeof getUserByEmail
>;
const mockGetTwoFactorTokenByEmail = getTwoFactorTokenByEmail as MockedFunction<
  typeof getTwoFactorTokenByEmail
>;
const mockDeleteTwoFactorTokenByToken =
  deleteTwoFactorTokenByToken as MockedFunction<
    typeof deleteTwoFactorTokenByToken
  >;
const mockSendTwoFactorEmail = sendTwoFactorEmail as MockedFunction<
  typeof sendTwoFactorEmail
>;
const mockGenerateTwoFactorConfirmation =
  generateTwoFactorConfirmation as MockedFunction<
    typeof generateTwoFactorConfirmation
  >;

describe("credentialsSignIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock hashPassword to return consistent values
    mockHashPassword.mockResolvedValue({
      hashedPassword: "hashed-password",
      salt: "user-salt",
    });
  });

  describe("Input validation", () => {
    it("should return error when user does not exist", async () => {
      mockGetUserByEmail.mockResolvedValue(undefined);

      const result = await credentialsSignIn({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        type: "NOT_FOUND",
        message: "Resource not found",
      });
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "nonexistent@example.com",
      });
    });

    it("should return error when user has no salt", async () => {
      const userWithoutSalt = createMockUser({ salt: null });
      mockGetUserByEmail.mockResolvedValue(userWithoutSalt);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        type: "NOT_FOUND",
        message: "Resource not found",
      });
    });

    it("should return error when user has no password", async () => {
      const userWithoutPassword = createMockUser({ password: null });
      mockGetUserByEmail.mockResolvedValue(userWithoutPassword);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        type: "NOT_FOUND",
        message: "Resource not found",
      });
    });
  });

  describe("Password verification", () => {
    it("should return error when password does not match", async () => {
      const mockUser = createMockUser();
      mockGetUserByEmail.mockResolvedValue(mockUser);
      mockHashPassword.mockResolvedValue({
        hashedPassword: "different-hash",
        salt: "user-salt",
      });

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(result).toEqual({
        type: "INVALID_LOGIN",
        message: "Invalid username or password",
      });
      expect(mockHashPassword).toHaveBeenCalledWith(
        "wrongpassword",
        "user-salt",
      );
    });

    it("should proceed when password matches", async () => {
      const mockUser = createMockUser();
      mockGetUserByEmail.mockResolvedValue(mockUser);
      mockHashPassword.mockResolvedValue({
        hashedPassword: "hashed-password",
        salt: "user-salt",
      });
      mockSignIn.mockResolvedValue(undefined);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "correctpassword",
      });

      expect(result).toEqual({
        twoFactor: null,
      });
      expect(mockHashPassword).toHaveBeenCalledWith(
        "correctpassword",
        "user-salt",
      );
    });
  });

  describe("Two-factor authentication flow", () => {
    const mockUserWith2FA = createMockUser({
      isTwoFactorEnabled: true,
      email: "test@example.com",
    });

    beforeEach(() => {
      mockGetUserByEmail.mockResolvedValue(mockUserWith2FA);
      mockHashPassword.mockResolvedValue({
        hashedPassword: "hashed-password",
        salt: "user-salt",
      });
    });

    it("should send 2FA email when no code provided", async () => {
      mockSendTwoFactorEmail.mockResolvedValue(true);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        twoFactor: true,
      });
      expect(mockSendTwoFactorEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });

    it("should return error when 2FA token does not exist", async () => {
      mockGetTwoFactorTokenByEmail.mockResolvedValue(undefined);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
        code: "123456",
      });

      expect(result).toEqual({
        type: "INVALID_TOKEN",
        message: "Invalid or malformed token",
      });
      expect(mockGetTwoFactorTokenByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });

    it("should return error when 2FA code does not match", async () => {
      const mockToken = createMockTwoFactorToken({ token: "654321" });
      mockGetTwoFactorTokenByEmail.mockResolvedValue(mockToken);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
        code: "123456",
      });

      expect(result).toEqual({
        type: "INVALID_TOKEN",
        message: "Invalid or malformed token",
      });
    });

    it("should return error when 2FA token has expired", async () => {
      const expiredToken = createMockTwoFactorToken({
        token: "123456",
        expires: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      });
      mockGetTwoFactorTokenByEmail.mockResolvedValue(expiredToken);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
        code: "123456",
      });

      expect(result).toEqual({
        type: "TOKEN_EXPIRED",
        message: "Token has expired",
      });
    });

    it("should return error when 2FA email could not be sent", async () => {
      mockSendTwoFactorEmail.mockResolvedValue(
        createDataAccessError({
          type: "EMAIL_SENDING_FAILED",
          message: "Email sending failed",
        }),
      );

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        type: "EMAIL_SENDING_FAILED",
        message: "Email sending failed",
      });
      expect(mockSendTwoFactorEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockGetTwoFactorTokenByEmail).not.toHaveBeenCalled();
    });

    it("should successfully sign in with valid 2FA code and no existing confirmation", async () => {
      const validToken = createMockTwoFactorToken({ token: "123456" });
      const mockConfirmation = createMockTwoFactorConfirmation();

      mockGetTwoFactorTokenByEmail.mockResolvedValue(validToken);
      mockDeleteTwoFactorTokenByToken.mockResolvedValue(undefined);
      mockGenerateTwoFactorConfirmation.mockResolvedValue(mockConfirmation);
      mockSignIn.mockResolvedValue(undefined);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
        code: "123456",
      });

      expect(result).toEqual({
        twoFactor: null,
      });
      expect(mockDeleteTwoFactorTokenByToken).toHaveBeenCalledWith({
        token: "123456",
      });
      expect(mockGenerateTwoFactorConfirmation).toHaveBeenCalledWith({
        userId: "user-123",
      });
    });

    it("should successfully sign in with valid 2FA code and delete existing confirmation", async () => {
      const validToken = createMockTwoFactorToken({ token: "123456" });
      const mockConfirmation = createMockTwoFactorConfirmation();

      mockGetTwoFactorTokenByEmail.mockResolvedValue(validToken);
      mockDeleteTwoFactorTokenByToken.mockResolvedValue(undefined);
      mockGenerateTwoFactorConfirmation.mockResolvedValue(mockConfirmation);
      mockSignIn.mockResolvedValue(undefined);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
        code: "123456",
      });

      expect(result).toEqual({
        twoFactor: null,
      });
      expect(mockDeleteTwoFactorTokenByToken).toHaveBeenCalledWith({
        token: "123456",
      });
      expect(mockGenerateTwoFactorConfirmation).toHaveBeenCalledWith({
        userId: "user-123",
      });
    });
  });

  describe("NextAuth signIn integration", () => {
    const mockUser = createMockUser();

    beforeEach(() => {
      mockGetUserByEmail.mockResolvedValue(mockUser);
      mockHashPassword.mockResolvedValue({
        hashedPassword: "hashed-password",
        salt: "user-salt",
      });
    });

    it("should handle CredentialsSignin AuthError", async () => {
      const authError = new (AuthError as any)(
        "Invalid credentials",
        "CredentialsSignin",
      );
      mockSignIn.mockRejectedValue(authError);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        type: "INVALID_LOGIN",
        message: "Invalid username or password",
      });
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      });
    });

    it("should handle other AuthError types", async () => {
      const authError = new (AuthError as any)("Other error", "OtherError");
      mockSignIn.mockRejectedValue(authError);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        type: "DATABASE_ERROR",
        message: "Something went wrong! Please try again.",
      });
    });

    it("should handle non-AuthError exceptions", async () => {
      const genericError = new Error("Network error");
      mockSignIn.mockRejectedValue(genericError);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        type: "DATABASE_ERROR",
        message: "Something went wrong! Please try again.",
      });
    });

    it("should successfully sign in when no errors occur", async () => {
      mockSignIn.mockResolvedValue(undefined);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        twoFactor: null,
      });
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle user with 2FA enabled but no email", async () => {
      const userWithout2FAEmail = createMockUser({
        isTwoFactorEnabled: true,
        email: undefined,
      });
      mockGetUserByEmail.mockResolvedValue(userWithout2FAEmail);
      mockHashPassword.mockResolvedValue({
        hashedPassword: "hashed-password",
        salt: "user-salt",
      });
      mockSignIn.mockResolvedValue(undefined);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        twoFactor: null,
      });
      expect(mockSendTwoFactorEmail).not.toHaveBeenCalled();
    });

    it("should handle user with 2FA disabled", async () => {
      const userWithout2FA = createMockUser({ isTwoFactorEnabled: false });
      mockGetUserByEmail.mockResolvedValue(userWithout2FA);
      mockHashPassword.mockResolvedValue({
        hashedPassword: "hashed-password",
        salt: "user-salt",
      });
      mockSignIn.mockResolvedValue(undefined);

      const result = await credentialsSignIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        twoFactor: null,
      });
      expect(mockSendTwoFactorEmail).not.toHaveBeenCalled();
      expect(mockGetTwoFactorTokenByEmail).not.toHaveBeenCalled();
    });
  });
});
