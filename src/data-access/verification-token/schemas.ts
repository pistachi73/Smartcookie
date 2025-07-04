import { z } from "zod";

export const SendEmailVerificationEmailSchema = z.object({
  email: z.string().email(),
});
