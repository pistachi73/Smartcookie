import { z } from "zod";

import { verifyPassword } from "@/data-access/auth/mutations";
import { getUserByEmail } from "@/data-access/user/queries";

export const authorize = async (
  credentials: Partial<Record<"email" | "password", unknown>>,
) => {
  try {
    const validatedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string(),
      })
      .safeParse(credentials);

    if (!validatedCredentials.success) return null;

    const { email, password } = validatedCredentials.data;

    const user = await getUserByEmail({ email });

    if (!user || !user.salt || !user.password) return null;

    const passwordsMatch = await verifyPassword({
      plainTextPassword: password,
      salt: user?.salt,
      hashedPassword: user?.password,
    });

    if (!passwordsMatch) return null;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
