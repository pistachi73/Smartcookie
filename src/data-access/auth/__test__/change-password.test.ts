import {
  type MockedFunction,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock("@/core/config/auth-config", () => ({
  signIn: vi.fn(),
}));

// Mock database imports to prevent environment variable access during module import
vi.mock("@/db", () => ({
  db: {
    transaction: vi.fn(),
  },
}));

vi.mock("@/data-access/password-reset-token/queries", () => ({
  getPasswordResetTokenByToken: vi.fn(),
}));

vi.mock("@/data-access/password-reset-token/mutations", () => ({
  deletePasswordResetTokenByToken: vi.fn(),
}));

vi.mock("@/data-access/user/queries", () => ({
  getUserByEmail: vi.fn(),
}));

vi.mock("@/data-access/user/mutations", () => ({
  updateUserPassword: vi.fn(),
}));

vi.mock("@/data-access/utils", () => ({
  hashPassword: vi.fn(),
}));

vi.mock("@/shared/lib/mail", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("@/data-access/verification-token/mutations", () => ({
  sendEmailVerificationEmail: vi.fn(),
}));

vi.mock("@/data-access/two-factor-token/mutations", () => ({
  deleteTwoFactorTokenByToken: vi.fn(),
  sendTwoFactorEmail: vi.fn(),
}));

vi.mock("@/data-access/two-factor-token/queries", () => ({
  getTwoFactorTokenByEmail: vi.fn(),
}));

vi.mock("@/data-access/two-factor-confirmation/mutations", () => ({
  generateTwoFactorConfirmation: vi.fn(),
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

import { createMockPasswordResetToken } from "@/data-access/password-reset-token/__mocks__";
import { deletePasswordResetTokenByToken } from "@/data-access/password-reset-token/mutations";
import { getPasswordResetTokenByToken } from "@/data-access/password-reset-token/queries";
import { createMockUser } from "@/data-access/user/__mocks__";
import { updateUserPassword } from "@/data-access/user/mutations";
import { getUserByEmail } from "@/data-access/user/queries";
import { db } from "@/db";
import { changePassword } from "../mutations";

const mockGetPasswordResetTokenByToken =
  getPasswordResetTokenByToken as MockedFunction<
    typeof getPasswordResetTokenByToken
  >;
const mockGetUserByEmail = getUserByEmail as MockedFunction<
  typeof getUserByEmail
>;
const mockDeletePasswordResetTokenByToken =
  deletePasswordResetTokenByToken as MockedFunction<
    typeof deletePasswordResetTokenByToken
  >;
const mockUpdateUserPassword = updateUserPassword as MockedFunction<
  typeof updateUserPassword
>;
const mockDbTransaction = db.transaction as MockedFunction<
  typeof db.transaction
>;

describe("changePassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock transaction to immediately execute the callback
    mockDbTransaction.mockImplementation(async (callback) => {
      return await callback({} as any);
    });
  });

  describe("Token validation", () => {
    it("should return error when token does not exist", async () => {
      mockGetPasswordResetTokenByToken.mockResolvedValue(undefined);

      const result = await changePassword({
        token: "invalid-token",
        password: "newpassword123",
      });

      expect(result).toEqual({
        type: "INVALID_TOKEN",
        message: "Invalid or malformed token",
      });
      expect(mockGetPasswordResetTokenByToken).toHaveBeenCalledWith({
        token: "invalid-token",
      });
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
    });

    it("should return error when token has expired", async () => {
      const expiredToken = createMockPasswordResetToken({
        expires: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      });
      mockGetPasswordResetTokenByToken.mockResolvedValue(expiredToken);

      const result = await changePassword({
        token: "expired-token",
        password: "newpassword123",
      });

      expect(result).toEqual({
        type: "TOKEN_EXPIRED",
        message: "Token has expired",
      });
      expect(mockGetPasswordResetTokenByToken).toHaveBeenCalledWith({
        token: "expired-token",
      });
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
    });

    it("should proceed when token is valid and not expired", async () => {
      const validToken = createMockPasswordResetToken({
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      });
      const existingUser = createMockUser();

      mockGetPasswordResetTokenByToken.mockResolvedValue(validToken);
      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockDeletePasswordResetTokenByToken.mockResolvedValue(undefined);
      mockUpdateUserPassword.mockResolvedValue(undefined);

      const result = await changePassword({
        token: "valid-token",
        password: "newpassword123",
      });

      expect(result).toBe(true);
      expect(mockGetPasswordResetTokenByToken).toHaveBeenCalledWith({
        token: "valid-token",
      });
    });
  });

  describe("User validation", () => {
    beforeEach(() => {
      const validToken = createMockPasswordResetToken({
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });
      mockGetPasswordResetTokenByToken.mockResolvedValue(validToken);
    });

    it("should return error when user does not exist", async () => {
      mockGetUserByEmail.mockResolvedValue(undefined);

      const result = await changePassword({
        token: "valid-token",
        password: "newpassword123",
      });

      expect(result).toEqual({
        type: "NOT_FOUND",
        message: "Resource not found",
      });
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockDbTransaction).not.toHaveBeenCalled();
    });

    it("should proceed when user exists", async () => {
      const existingUser = createMockUser();
      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockDeletePasswordResetTokenByToken.mockResolvedValue(undefined);
      mockUpdateUserPassword.mockResolvedValue(undefined);

      const result = await changePassword({
        token: "valid-token",
        password: "newpassword123",
      });

      expect(result).toBe(true);
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });

  describe("Password update transaction", () => {
    beforeEach(() => {
      const validToken = createMockPasswordResetToken({
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });
      const existingUser = createMockUser();

      mockGetPasswordResetTokenByToken.mockResolvedValue(validToken);
      mockGetUserByEmail.mockResolvedValue(existingUser);
    });

    it("should execute transaction with correct operations", async () => {
      mockDeletePasswordResetTokenByToken.mockResolvedValue(undefined);
      mockUpdateUserPassword.mockResolvedValue(undefined);

      const result = await changePassword({
        token: "valid-token",
        password: "newpassword123",
      });

      expect(result).toBe(true);
      expect(mockDbTransaction).toHaveBeenCalledTimes(1);
      expect(mockDeletePasswordResetTokenByToken).toHaveBeenCalledWith({
        token: "valid-token",
        trx: {} as any,
      });
      expect(mockUpdateUserPassword).toHaveBeenCalledWith({
        trx: {} as any,
        data: {
          userId: "user-123",
          password: "newpassword123",
        },
      });
    });
  });
});
