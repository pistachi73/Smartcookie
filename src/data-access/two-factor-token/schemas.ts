import { z } from "zod";

export const SendTwoFactorTokenEmailSchema = z.object({
  email: z.string().email(),
});
