"use server";

import { sendEmailVerificationEmail } from "@/data-access/verification-token";
import { publicAction } from "@/shared/lib/safe-action";
import { z } from "zod";

export const resendEmailVerificationEmailAction = publicAction
  .schema(z.string())
  .action(async ({ parsedInput: email }) => {
    return await sendEmailVerificationEmail(email);
  });
