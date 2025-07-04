import type { TwoFactorToken } from "@/db/schema";

export const createMockTwoFactorToken = (
  overrides: Partial<TwoFactorToken> = {},
): TwoFactorToken => ({
  id: 1,
  email: "test@example.com",
  token: "123456",
  expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
  ...overrides,
});
