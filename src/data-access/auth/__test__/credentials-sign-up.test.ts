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
  sendVerificationEmail: vi.fn(),
}));

vi.mock("@/data-access/utils", () => ({
  hashPassword: vi.fn(),
  generateSecureRandomInt: vi.fn(),
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
}));

vi.mock("@/data-access/user/queries", () => ({
  getUserByEmail: vi.fn(),
}));

vi.mock("@/data-access/user/mutations", () => ({
  createUser: vi.fn(),
}));

vi.mock("@/data-access/verification-token/mutations", () => ({
  sendEmailVerificationEmail: vi.fn(),
}));

vi.mock("@/data-access/verification-token/queries", () => ({
  getVerificationTokenByTokenAndEmail: vi.fn(),
}));

import { createDataAccessError } from "@/data-access/errors";
import { createMockUser } from "@/data-access/user/__mocks__";
import { createUser } from "@/data-access/user/mutations";
import { getUserByEmail } from "@/data-access/user/queries";
import { createMockVerificationToken } from "@/data-access/verification-token/__mocks__";
import { sendEmailVerificationEmail } from "@/data-access/verification-token/mutations";
import { getVerificationTokenByTokenAndEmail } from "@/data-access/verification-token/queries";
import { credentialsSignUp } from "../mutations";

const mockGetUserByEmail = getUserByEmail as MockedFunction<
  typeof getUserByEmail
>;
const mockCreateUser = createUser as MockedFunction<typeof createUser>;
const mockSendEmailVerificationEmail =
  sendEmailVerificationEmail as MockedFunction<
    typeof sendEmailVerificationEmail
  >;
const mockGetVerificationTokenByTokenAndEmail =
  getVerificationTokenByTokenAndEmail as MockedFunction<
    typeof getVerificationTokenByTokenAndEmail
  >;

describe("credentialsSignUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("User already exists validation", () => {
    it("should return error when user already exists", async () => {
      const existingUser = createMockUser();
      mockGetUserByEmail.mockResolvedValue(existingUser);

      const result = await credentialsSignUp({
        email: "existing@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        type: "DUPLICATE_RESOURCE",
        message: "Resource already exists",
      });
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "existing@example.com",
      });
      expect(mockSendEmailVerificationEmail).not.toHaveBeenCalled();
    });

    it("should proceed when user does not exist", async () => {
      mockGetUserByEmail.mockResolvedValue(undefined);
      mockSendEmailVerificationEmail.mockResolvedValue(true);

      const result = await credentialsSignUp({
        email: "new@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        emailVerification: true,
        user: null,
      });
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "new@example.com",
      });
      expect(mockSendEmailVerificationEmail).toHaveBeenCalledWith({
        email: "new@example.com",
      });
    });
  });

  describe("Email verification flow without code", () => {
    beforeEach(() => {
      mockGetUserByEmail.mockResolvedValue(undefined);
    });

    it("should return error when email sending fails", async () => {
      mockSendEmailVerificationEmail.mockResolvedValue(
        createDataAccessError("EMAIL_SENDING_FAILED"),
      );

      const result = await credentialsSignUp({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        type: "EMAIL_SENDING_FAILED",
        message: "Email sending failed",
      });
      expect(mockSendEmailVerificationEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });

  describe("Email verification flow with code", () => {
    beforeEach(() => {
      mockGetUserByEmail.mockResolvedValue(undefined);
    });

    it("should return error when verification token does not exist", async () => {
      mockGetVerificationTokenByTokenAndEmail.mockResolvedValue(undefined);

      const result = await credentialsSignUp({
        email: "test@example.com",
        password: "password123",
        emailVerificationCode: "123456",
      });

      expect(result).toEqual({
        type: "INVALID_TOKEN",
        message: "Invalid or malformed token",
      });
      expect(mockGetVerificationTokenByTokenAndEmail).toHaveBeenCalledWith({
        token: "123456",
        email: "test@example.com",
      });
    });

    it("should return error when verification token has expired", async () => {
      const expiredToken = createMockVerificationToken({
        expires: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      });
      mockGetVerificationTokenByTokenAndEmail.mockResolvedValue(expiredToken);

      const result = await credentialsSignUp({
        email: "test@example.com",
        password: "password123",
        emailVerificationCode: "123456",
      });

      expect(result).toEqual({
        type: "TOKEN_EXPIRED",
        message: "Token has expired",
      });
    });

    it("should return error when user already exists after token validation", async () => {
      const validToken = createMockVerificationToken({
        email: "test@example.com",
      });
      mockGetVerificationTokenByTokenAndEmail.mockResolvedValue(validToken);

      // Mock the second getUserByEmail call (after token validation) to return an existing user
      mockGetUserByEmail
        .mockResolvedValueOnce(undefined) // First call in the beginning
        .mockResolvedValueOnce(createMockUser()); // Second call after token validation

      const result = await credentialsSignUp({
        email: "test@example.com",
        password: "password123",
        emailVerificationCode: "123456",
      });

      expect(result).toEqual({
        type: "DUPLICATE_RESOURCE",
        message: "Resource already exists",
      });
      expect(mockGetUserByEmail).toHaveBeenCalledTimes(2);
      expect(mockGetUserByEmail).toHaveBeenNthCalledWith(2, {
        email: "test@example.com",
      });
    });

    it("should return error when user creation fails", async () => {
      const validToken = createMockVerificationToken({
        email: "test@example.com",
      });
      mockGetVerificationTokenByTokenAndEmail.mockResolvedValue(validToken);
      mockGetUserByEmail
        .mockResolvedValueOnce(undefined) // First call
        .mockResolvedValueOnce(undefined); // Second call after token validation
      mockCreateUser.mockResolvedValue(undefined);

      const result = await credentialsSignUp({
        email: "test@example.com",
        password: "password123",
        emailVerificationCode: "123456",
      });

      expect(result).toEqual({
        type: "DATABASE_ERROR",
        message: "Database operation failed",
      });
      expect(mockCreateUser).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          name: "test",
          password: "password123",
        },
      });
    });

    it("should successfully create user with valid verification code", async () => {
      const validToken = createMockVerificationToken({
        email: "test@example.com",
      });
      const createdUser = createMockUser({
        email: "test@example.com",
        name: "test",
      });

      mockGetVerificationTokenByTokenAndEmail.mockResolvedValue(validToken);
      mockGetUserByEmail
        .mockResolvedValueOnce(undefined) // First call
        .mockResolvedValueOnce(undefined); // Second call after token validation
      mockCreateUser.mockResolvedValue(createdUser);

      const result = await credentialsSignUp({
        email: "test@example.com",
        password: "password123",
        emailVerificationCode: "123456",
      });

      expect(result).toEqual({
        emailVerification: false,
        user: createdUser,
      });
      expect(mockCreateUser).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          name: "test",
          password: "password123",
        },
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle token from different email", async () => {
      const tokenForDifferentEmail = createMockVerificationToken({
        email: "different@example.com",
        token: "123456",
      });
      mockGetVerificationTokenByTokenAndEmail.mockResolvedValue(
        tokenForDifferentEmail,
      );
      mockGetUserByEmail.mockResolvedValue(undefined);

      await credentialsSignUp({
        email: "test@example.com",
        password: "password123",
        emailVerificationCode: "123456",
      });

      // Should check for user with the token's email, not the provided email
      expect(mockGetUserByEmail).toHaveBeenCalledTimes(2);
      expect(mockGetUserByEmail).toHaveBeenNthCalledWith(2, {
        email: "different@example.com",
      });
      expect(mockGetVerificationTokenByTokenAndEmail).toHaveBeenCalledWith({
        token: "123456",
        email: "test@example.com",
      });
    });
  });
});
