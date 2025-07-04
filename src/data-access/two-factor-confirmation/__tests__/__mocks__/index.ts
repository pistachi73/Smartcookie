import type { TwoFactorConfirmation } from "@/db/schema";

export const createMockTwoFactorConfirmation = (
  overrides: Partial<TwoFactorConfirmation> = {},
): TwoFactorConfirmation => ({
  id: 1,
  token: "confirmation-token",
  userId: "user-123",
  ...overrides,
});
