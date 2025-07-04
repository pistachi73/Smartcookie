import {
  type MockedFunction,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

// Mock the data access functions
vi.mock("@/data-access/auth/mutations", () => ({
  verifyPassword: vi.fn(),
}));

vi.mock("@/data-access/user/queries", () => ({
  getUserByEmail: vi.fn(),
}));

import { verifyPassword } from "@/data-access/auth/mutations";
import { createMockUser } from "@/data-access/user/__mocks__";
import { getUserByEmail } from "@/data-access/user/queries";
import { authorize } from "../authorize";

const mockVerifyPassword = verifyPassword as MockedFunction<
  typeof verifyPassword
>;
const mockGetUserByEmail = getUserByEmail as MockedFunction<
  typeof getUserByEmail
>;

describe("authorize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Input validation", () => {
    it("should return null when credentials are missing", async () => {
      const result = await authorize({});

      expect(result).toBeNull();
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("should return null when email is missing", async () => {
      const credentials = {
        password: "password123",
      };

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("should return null when password is missing", async () => {
      const credentials = {
        email: "test@example.com",
      };

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("should return null when email is invalid", async () => {
      const credentials = {
        email: "invalid-email",
        password: "password123",
      };

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("should return null when email is not a string", async () => {
      const credentials = {
        email: 123,
        password: "password123",
      };

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("should return null when password is not a string", async () => {
      const credentials = {
        email: "test@example.com",
        password: 123,
      };

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });
  });

  describe("User retrieval", () => {
    it("should return null when user is not found", async () => {
      const credentials = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      mockGetUserByEmail.mockResolvedValue(undefined);

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "nonexistent@example.com",
      });
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("should return null when user exists but has no password", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const user = createMockUser({
        email: "test@example.com",
        password: null,
        salt: "user-salt",
      });

      mockGetUserByEmail.mockResolvedValue(user);

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("should return null when user exists but has no salt", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const user = createMockUser({
        email: "test@example.com",
        password: "hashed-password",
        salt: null,
      });

      mockGetUserByEmail.mockResolvedValue(user);

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });
  });

  describe("Password verification", () => {
    it("should return null when password verification fails", async () => {
      const credentials = {
        email: "test@example.com",
        password: "wrong-password",
      };

      const user = createMockUser({
        email: "test@example.com",
        password: "hashed-password",
        salt: "user-salt",
      });

      mockGetUserByEmail.mockResolvedValue(user);
      mockVerifyPassword.mockResolvedValue(false);

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockVerifyPassword).toHaveBeenCalledWith({
        plainTextPassword: "wrong-password",
        salt: "user-salt",
        hashedPassword: "hashed-password",
      });
    });

    it("should return user when password verification succeeds", async () => {
      const credentials = {
        email: "test@example.com",
        password: "correct-password",
      };

      const user = createMockUser({
        email: "test@example.com",
        password: "hashed-password",
        salt: "user-salt",
      });

      mockGetUserByEmail.mockResolvedValue(user);
      mockVerifyPassword.mockResolvedValue(true);

      const result = await authorize(credentials);

      expect(result).toEqual(user);
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockVerifyPassword).toHaveBeenCalledWith({
        plainTextPassword: "correct-password",
        salt: "user-salt",
        hashedPassword: "hashed-password",
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle empty string email", async () => {
      const credentials = {
        email: "",
        password: "password123",
      };

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("should handle empty string password", async () => {
      const credentials = {
        email: "test@example.com",
        password: "",
      };

      const user = createMockUser({
        email: "test@example.com",
        password: "hashed-password",
        salt: "user-salt",
      });

      mockGetUserByEmail.mockResolvedValue(user);
      mockVerifyPassword.mockResolvedValue(false);

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockVerifyPassword).toHaveBeenCalledWith({
        plainTextPassword: "",
        salt: "user-salt",
        hashedPassword: "hashed-password",
      });
    });

    it("should handle whitespace-only email", async () => {
      const credentials = {
        email: "   ",
        password: "password123",
      };

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("should handle different user roles", async () => {
      const credentials = {
        email: "admin@example.com",
        password: "admin-password",
      };

      const adminUser = createMockUser({
        email: "admin@example.com",
        role: "ADMIN",
        password: "hashed-password",
        salt: "admin-salt",
      });

      mockGetUserByEmail.mockResolvedValue(adminUser);
      mockVerifyPassword.mockResolvedValue(true);

      const result = await authorize(credentials);

      expect(result).toEqual(adminUser);
      expect(result?.role).toBe("ADMIN");
    });

    it("should handle user with two-factor enabled", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const user = createMockUser({
        email: "test@example.com",
        isTwoFactorEnabled: true,
        password: "hashed-password",
        salt: "user-salt",
      });

      mockGetUserByEmail.mockResolvedValue(user);
      mockVerifyPassword.mockResolvedValue(true);

      const result = await authorize(credentials);

      expect(result).toEqual(user);
      expect(result?.isTwoFactorEnabled).toBe(true);
    });
  });

  describe("Error handling", () => {
    it("should return null when database errors occur", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      mockGetUserByEmail.mockRejectedValue(
        new Error("Database connection failed"),
      );

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("should return null when password verification errors occur", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const user = createMockUser({
        email: "test@example.com",
        password: "hashed-password",
        salt: "user-salt",
      });

      mockGetUserByEmail.mockResolvedValue(user);
      mockVerifyPassword.mockRejectedValue(
        new Error("Password verification failed"),
      );

      const result = await authorize(credentials);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockVerifyPassword).toHaveBeenCalledWith({
        plainTextPassword: "password123",
        salt: "user-salt",
        hashedPassword: "hashed-password",
      });
    });
  });

  describe("Type safety", () => {
    it("should handle undefined credentials", async () => {
      const result = await authorize(undefined as any);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("should handle null credentials", async () => {
      const result = await authorize(null as any);

      expect(result).toBeNull();
      expect(mockGetUserByEmail).not.toHaveBeenCalled();
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });
  });
});
