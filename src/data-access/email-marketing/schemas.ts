import { z } from "zod";

export const AddEmailMarketingSubscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
});
