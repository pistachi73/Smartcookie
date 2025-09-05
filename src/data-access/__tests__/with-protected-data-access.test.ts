import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedFunction,
  vi,
} from "vitest";
import { z } from "zod";

import { currentUser } from "@/shared/lib/auth";

import { createMockUser } from "@/data-access/user/__mocks__";
import type { AuthUser } from "@/types/next-auth";
import { withProtectedDataAccess } from "../with-protected-data-access";

vi.mock("@/shared/lib/auth", () => ({
  currentUser: vi.fn(),
}));

const mockCurrentUser = currentUser as MockedFunction<typeof currentUser>;

describe("withProtectedDataAccess", () => {
  const mockUser: AuthUser = {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
    role: "USER",
    isTwoFactorEnabled: false,
    isOAuth: false,
    stripeCustomerId: null,
    subscriptionTier: undefined,
    hasActiveSubscription: false,
  };

  const testSchema = z.object({
    name: z.string(),
    age: z.number().min(0),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return authentication error when user is not authenticated and requireAuth is true", async () => {
      mockCurrentUser.mockResolvedValue(undefined);

      const callback = vi.fn();
      const protectedFunction = withProtectedDataAccess({
        callback,
        options: { requireAuth: true },
      });

      const result = await protectedFunction();

      expect(result).toEqual({
        type: "AUTHENTICATION_ERROR",
        message: "You must be logged in to access this resource",
      });
      expect(callback).not.toHaveBeenCalled();
    });

    it("should return authentication error when user has no id and requireAuth is true", async () => {
      mockCurrentUser.mockResolvedValue({ ...mockUser, id: "" } as AuthUser);

      const callback = vi.fn();
      const protectedFunction = withProtectedDataAccess({
        callback,
        options: { requireAuth: true },
      });

      const result = await protectedFunction();

      expect(result).toEqual({
        type: "AUTHENTICATION_ERROR",
        message: "You must be logged in to access this resource",
        meta: undefined,
      });
      expect(callback).not.toHaveBeenCalled();
    });

    it("should allow unauthenticated access when requireAuth is false", async () => {
      mockCurrentUser.mockResolvedValue(undefined);

      const callback = vi.fn().mockResolvedValue("success");
      const protectedFunction = withProtectedDataAccess({
        callback,
        options: { requireAuth: false },
      });

      const result = await protectedFunction();

      expect(result).toBe("success");
      expect(callback).toHaveBeenCalledWith(undefined);
    });

    it("should pass authenticated user when authentication is successful", async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const callback = vi.fn().mockResolvedValue("success");
      const protectedFunction = withProtectedDataAccess({
        callback,
      });

      const result = await protectedFunction();

      expect(result).toBe("success");
      expect(callback).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("Validation with Schema", () => {
    it("should validate input data and pass validated data to callback", async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const callback = vi.fn().mockResolvedValue("success");
      const protectedFunction = withProtectedDataAccess({
        schema: testSchema,
        callback,
      });

      const inputData = { name: "John", age: 30 };
      const result = await protectedFunction(inputData);

      expect(result).toBe("success");
      expect(callback).toHaveBeenCalledWith(inputData, mockUser);
    });

    it("should return validation error for invalid input data", async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const callback = vi.fn();
      const protectedFunction = withProtectedDataAccess({
        schema: testSchema,
        callback,
      });

      const invalidData = { name: "John", age: -5 };
      const result = await protectedFunction(invalidData);

      expect(result).toEqual({
        type: "VALIDATION_ERROR",
        message: "Invalid input data",
        meta: undefined,
      });
      expect(callback).not.toHaveBeenCalled();
    });

    it("should return validation error for missing required fields", async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const callback = vi.fn();
      const protectedFunction = withProtectedDataAccess({
        schema: testSchema,
        callback,
      });

      const incompleteData = { name: "John" };
      const result = await protectedFunction(incompleteData as any);

      expect(result).toEqual({
        type: "VALIDATION_ERROR",
        message: "Invalid input data",
        meta: undefined,
      });
      expect(callback).not.toHaveBeenCalled();
    });

    it("should handle empty arguments when schema is provided", async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const callback = vi.fn().mockResolvedValue("success");
      const protectedFunction = withProtectedDataAccess({
        schema: testSchema,
        callback,
      });

      const result = await (protectedFunction as any)();

      expect(result).toBe("success");
      expect(callback).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("Without Schema", () => {
    it("should call callback with only user when no schema provided", async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const callback = vi.fn().mockResolvedValue("no-schema-success");
      const protectedFunction = withProtectedDataAccess({
        callback,
      });

      const result = await protectedFunction();

      expect(result).toBe("no-schema-success");
      expect(callback).toHaveBeenCalledWith(mockUser);
    });

    it("should work without schema and with requireAuth false", async () => {
      mockCurrentUser.mockResolvedValue(undefined);

      const callback = vi.fn().mockResolvedValue("unauthenticated-success");
      const protectedFunction = withProtectedDataAccess({
        callback,
        options: { requireAuth: false },
      });

      const result = await protectedFunction();

      expect(result).toBe("unauthenticated-success");
      expect(callback).toHaveBeenCalledWith(undefined);
    });
  });

  describe("Options Configuration", () => {
    it("should use default requireAuth as true when not specified", async () => {
      mockCurrentUser.mockResolvedValue(undefined);

      const callback = vi.fn();
      const protectedFunction = withProtectedDataAccess({
        callback,
      });

      const result = await protectedFunction();

      expect(result).toEqual({
        type: "AUTHENTICATION_ERROR",
        message: "You must be logged in to access this resource",
        meta: undefined,
      });
      expect(callback).not.toHaveBeenCalled();
    });

    it("should always validate when schema is provided", async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const callback = vi.fn();
      const protectedFunction = withProtectedDataAccess({
        schema: testSchema,
        callback,
      });

      const invalidData = { name: "John", age: -5 };
      const result = await protectedFunction(invalidData);

      expect(result).toEqual({
        type: "VALIDATION_ERROR",
        message: "Invalid input data",
        meta: undefined,
      });
      expect(callback).not.toHaveBeenCalled();
    });

    it("should not validate when no schema is provided", async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const callback = vi.fn().mockResolvedValue("success");
      const protectedFunction = withProtectedDataAccess({
        callback,
      });

      const result = await protectedFunction();

      expect(result).toBe("success");
      expect(callback).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("Complex Type Scenarios", () => {
    it("should handle complex schema validation", async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const complexSchema = z.object({
        user: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        preferences: z.array(z.string()),
        settings: z.record(z.boolean()),
      });

      const callback = vi.fn().mockResolvedValue("complex-success");
      const protectedFunction = withProtectedDataAccess({
        schema: complexSchema,
        callback,
      });

      const complexData = {
        user: {
          name: "John Doe",
          email: "john@example.com",
        },
        preferences: ["dark-mode", "notifications"],
        settings: {
          autoSave: true,
          syncData: false,
        },
      };

      const result = await protectedFunction(complexData);

      expect(result).toBe("complex-success");
      expect(callback).toHaveBeenCalledWith(complexData, mockUser);
    });

    it("should handle optional schema fields", async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const optionalSchema = z.object({
        required: z.string(),
        optional: z.string().optional(),
      });

      const callback = vi.fn().mockResolvedValue("optional-success");
      const protectedFunction = withProtectedDataAccess({
        schema: optionalSchema,
        callback,
      });

      const dataWithOptional = { required: "test", optional: "value" };
      const dataWithoutOptional = { required: "test" };

      const result1 = await protectedFunction(dataWithOptional);
      const result2 = await protectedFunction(dataWithoutOptional);

      expect(result1).toBe("optional-success");
      expect(result2).toBe("optional-success");
      expect(callback).toHaveBeenCalledWith(dataWithOptional, mockUser);
      expect(callback).toHaveBeenCalledWith(dataWithoutOptional, mockUser);
    });
  });

  describe("Error Handling", () => {
    it("should handle callback errors gracefully", async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const callback = vi.fn().mockRejectedValue(new Error("Callback error"));
      const protectedFunction = withProtectedDataAccess({
        callback,
      });

      await expect(protectedFunction()).rejects.toThrow("Callback error");
    });

    it("should handle authentication errors from currentUser", async () => {
      mockCurrentUser.mockRejectedValue(new Error("Auth service error"));

      const callback = vi.fn();
      const protectedFunction = withProtectedDataAccess({
        callback,
      });

      await expect(protectedFunction()).rejects.toThrow("Auth service error");
    });
  });

  describe("Integration Scenarios", () => {
    it("should work with real-world user data structure", async () => {
      const realUser = createMockUser({
        id: "real-user-456",
        email: "real@example.com",
        name: "Real User",
        role: "ADMIN",
        isTwoFactorEnabled: true,
        stripeCustomerId: "cus_123",
      });

      mockCurrentUser.mockResolvedValue({
        ...realUser,
        isOAuth: false,
        hasActiveSubscription: false,
        subscriptionTier: undefined,
      } as AuthUser);

      const userSchema = z.object({
        action: z.enum(["create", "update", "delete"]),
        resourceId: z.string(),
      });

      const callback = vi
        .fn()
        .mockResolvedValue({ success: true, userId: realUser.id });
      const protectedFunction = withProtectedDataAccess({
        schema: userSchema,
        callback,
      });

      const actionData = {
        action: "create" as const,
        resourceId: "resource-123",
      };
      const result = await protectedFunction(actionData);

      expect(result).toEqual({ success: true, userId: "real-user-456" });
      expect(callback).toHaveBeenCalledWith(actionData, {
        ...realUser,
        isOAuth: false,
        hasActiveSubscription: false,
        subscriptionTier: undefined,
      });
    });

    it("should handle mixed authentication and validation scenarios", async () => {
      const partialUser = createMockUser({ id: "" });
      mockCurrentUser.mockResolvedValue({
        ...partialUser,
        isOAuth: false,
        hasActiveSubscription: false,
        subscriptionTier: undefined,
      } as AuthUser);

      const callback = vi.fn();
      const protectedFunction = withProtectedDataAccess({
        schema: testSchema,
        callback,
        options: { requireAuth: true },
      });

      const validData = { name: "Test", age: 25 };
      const result = await protectedFunction(validData);

      expect(result).toEqual({
        type: "AUTHENTICATION_ERROR",
        message: "You must be logged in to access this resource",
        meta: undefined,
      });
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
