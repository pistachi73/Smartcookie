import { z } from "zod";

import { DatabaseTransactionSchema } from "../shared-schemas";

export const CreatePasswordResetTokenSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  expires: z.date(),
});

export const DeletePasswordResetTokenByTokenSchema = z.object({
  token: z.string(),
  trx: DatabaseTransactionSchema,
});
