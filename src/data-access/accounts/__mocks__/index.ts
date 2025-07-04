import type { Account } from "@/db/schema";

export const createMockAccount = (
  overrides: Partial<Account> = {},
): Account => ({
  userId: "user-123",
  type: "oauth",
  provider: "google",
  providerAccountId: "google-123",
  refresh_token: null,
  access_token: null,
  expires_at: null,
  token_type: null,
  scope: null,
  id_token: null,
  session_state: null,
  ...overrides,
});
