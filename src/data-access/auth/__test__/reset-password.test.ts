import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedFunction,
  vi,
} from "vitest";

// Mock database imports to prevent environment variable access during module import
vi.mock("@/db", () => ({
  db: {},
}));

vi.mock("@/shared/lib/mail", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("@/data-access/utils", () => ({
  hashPassword: vi.fn(),
  generateRandomToken: vi.fn(),
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

vi.mock("@/core/config/auth-config", () => ({
  signIn: vi.fn(),
  auth: vi.fn(),
}));

vi.mock("@/data-access/user/queries", () => ({
  getUserByEmail: vi.fn(),
}));

vi.mock("@/data-access/password-reset-token/mutations", () => ({
  generatePasswordResetToken: vi.fn(),
}));

import { sendPasswordResetEmail } from "@/shared/lib/mail";

import { createMockPasswordResetToken } from "@/data-access/password-reset-token/__mocks__";
import { generatePasswordResetToken } from "@/data-access/password-reset-token/mutations";
import { createMockUser } from "@/data-access/user/__mocks__";
import { getUserByEmail } from "@/data-access/user/queries";
import { resetPassword } from "../mutations";

const mockGetUserByEmail = getUserByEmail as MockedFunction<
  typeof getUserByEmail
>;
const mockGeneratePasswordResetToken =
  generatePasswordResetToken as MockedFunction<
    typeof generatePasswordResetToken
  >;
const mockSendPasswordResetEmail = sendPasswordResetEmail as MockedFunction<
  typeof sendPasswordResetEmail
>;

describe("resetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("User validation", () => {
    it("should return error when user does not exist", async () => {
      mockGetUserByEmail.mockResolvedValue(undefined);

      const result = await resetPassword({
        email: "nonexistent@example.com",
      });

      expect(result).toEqual({
        type: "NOT_FOUND",
        message: "No account found with this email address",
        meta: undefined,
      });
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "nonexistent@example.com",
      });
      expect(mockGeneratePasswordResetToken).not.toHaveBeenCalled();
    });

    it("should proceed when user exists", async () => {
      const existingUser = createMockUser();
      const passwordResetToken = createMockPasswordResetToken();

      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGeneratePasswordResetToken.mockResolvedValue(passwordResetToken);
      mockSendPasswordResetEmail.mockResolvedValue(undefined);

      const result = await resetPassword({
        email: "test@example.com",
      });

      expect(result).toBe(true);
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });

  describe("Password reset token generation", () => {
    beforeEach(() => {
      const existingUser = createMockUser();
      mockGetUserByEmail.mockResolvedValue(existingUser);
    });

    it("should return error when token generation fails", async () => {
      mockGeneratePasswordResetToken.mockResolvedValue(undefined);

      const result = await resetPassword({
        email: "test@example.com",
      });

      expect(result).toEqual({
        type: "DATABASE_ERROR",
        message: "Error generating password reset token",
        meta: undefined,
      });
      expect(mockGeneratePasswordResetToken).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it("should generate token successfully when user exists", async () => {
      const passwordResetToken = createMockPasswordResetToken();
      mockGeneratePasswordResetToken.mockResolvedValue(passwordResetToken);
      mockSendPasswordResetEmail.mockResolvedValue(undefined);

      const result = await resetPassword({
        email: "test@example.com",
      });

      expect(result).toBe(true);
      expect(mockGeneratePasswordResetToken).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });

  describe("Email sending", () => {
    beforeEach(() => {
      const existingUser = createMockUser();
      const passwordResetToken = createMockPasswordResetToken();
      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGeneratePasswordResetToken.mockResolvedValue(passwordResetToken);
    });

    it("should return error when email sending fails", async () => {
      const emailError = new Error("Email service unavailable");
      mockSendPasswordResetEmail.mockRejectedValue(emailError);

      const result = await resetPassword({
        email: "test@example.com",
      });

      expect(result).toEqual({
        type: "EMAIL_SENDING_FAILED",
        message: "Failed to send password reset email",
      });
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith({
        token: "reset-token-123",
        email: "test@example.com",
      });
    });

    it("should successfully send reset email", async () => {
      mockSendPasswordResetEmail.mockResolvedValue(undefined);

      const result = await resetPassword({
        email: "test@example.com",
      });

      expect(result).toBe(true);
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith({
        token: "reset-token-123",
        email: "test@example.com",
      });
    });

    it("should send email with correct token and email from generated token", async () => {
      const customToken = createMockPasswordResetToken({
        token: "custom-reset-token",
        email: "custom@example.com",
      });
      mockGeneratePasswordResetToken.mockResolvedValue(customToken);
      mockSendPasswordResetEmail.mockResolvedValue(undefined);

      const result = await resetPassword({
        email: "test@example.com",
      });

      expect(result).toBe(true);
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith({
        token: "custom-reset-token",
        email: "custom@example.com",
      });
    });
  });

  describe("Complete flow scenarios", () => {
    it("should successfully complete entire reset password flow", async () => {
      const existingUser = createMockUser({
        email: "user@example.com",
        name: "Test User",
      });
      const passwordResetToken = createMockPasswordResetToken({
        token: "secure-token-456",
        email: "user@example.com",
      });

      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGeneratePasswordResetToken.mockResolvedValue(passwordResetToken);
      mockSendPasswordResetEmail.mockResolvedValue(undefined);

      const result = await resetPassword({
        email: "user@example.com",
      });

      expect(result).toBe(true);

      // Verify all steps were called in order
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "user@example.com",
      });
      expect(mockGeneratePasswordResetToken).toHaveBeenCalledWith({
        email: "user@example.com",
      });
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith({
        token: "secure-token-456",
        email: "user@example.com",
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle token generation returning null", async () => {
      const existingUser = createMockUser();
      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGeneratePasswordResetToken.mockResolvedValue(null as any);

      const result = await resetPassword({
        email: "test@example.com",
      });

      expect(result).toEqual({
        type: "DATABASE_ERROR",
        message: "Error generating password reset token",
        meta: undefined,
      });
    });

    it("should handle token generation returning undefined", async () => {
      const existingUser = createMockUser();
      mockGetUserByEmail.mockResolvedValue(existingUser);
      mockGeneratePasswordResetToken.mockResolvedValue(undefined);

      const result = await resetPassword({
        email: "test@example.com",
      });

      expect(result).toEqual({
        type: "DATABASE_ERROR",
        message: "Error generating password reset token",
        meta: undefined,
      });
    });
  });
});
