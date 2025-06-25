import { z } from "zod";

export const CreateEmailMarketingSchema = z.object({
  email: z.string().email("Invalid email address"),
});
