import { verifyPassword } from "@/data-access/auth/mutations";
import { getUserByEmail } from "@/data-access/user/queries";
import { z } from "zod";

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
    console.log("returning user, authorized");
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
