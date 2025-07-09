import type { User } from "@/db/schema";

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: "user-123",
  email: "test@example.com",
  name: "John Doe",
  image: null,
  emailVerified: null,
  password: "hashed-password",
  salt: "user-salt",
  role: "USER",
  isTwoFactorEnabled: false,
  stripeCustomerId: null,
  ...overrides,
});
