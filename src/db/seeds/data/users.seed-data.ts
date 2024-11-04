export default [
  {
    name: "Oscar Pulido",
    email: "oscarpulido98@gmail.com",
    password: "password",
    role: "USER",
    isTwoFactorEnabled: false,
  },
  {
    name: "Alice Johnson",
    email: "test1@example.com",
    password: "password",
    role: "USER",
    isTwoFactorEnabled: false,
  },
  {
    name: "Bob Smith",
    email: "test2@test.com",
    password: "password",
    role: "USER",
    isTwoFactorEnabled: true,
  },
] as const;
