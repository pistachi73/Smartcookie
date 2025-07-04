// Mock verification token type based on schema
type MockVerificationToken = {
  id: number;
  token: string;
  email: string;
  expires: Date;
};

export const createMockVerificationToken = (
  overrides: Partial<MockVerificationToken> = {},
): MockVerificationToken => ({
  id: 1,
  token: "123456",
  email: "test@example.com",
  expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
  ...overrides,
});
