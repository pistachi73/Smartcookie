import type { PasswordResetToken } from "@/db/schema";

export const createMockPasswordResetToken = (
  overrides: Partial<PasswordResetToken> = {},
): PasswordResetToken => ({
  id: 1,
  token: "reset-token-123",
  email: "test@example.com",
  expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  ...overrides,
});
