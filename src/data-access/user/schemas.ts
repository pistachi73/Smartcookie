import type { User } from "@/db/schema";
import { z } from "zod";
import { DatabaseTransactionSchema } from "../shared-schemas";

export const GetUserAndAccountByEmailSchema = z.object({
  email: z.string().email(),
});

export const UpdateUserSchema = z.object({
  id: z.string(),
  data: z.custom<Partial<User>>(),
  trx: DatabaseTransactionSchema,
});

export const InsertUserDataSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  password: z.string(),
  name: z.string().optional(),
  image: z.string().optional(),
  emailVerified: z.date().optional(),
  salt: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
});

export const CreateUserSchema = z.object({
  data: InsertUserDataSchema,
  trx: DatabaseTransactionSchema,
});

export const UpdateUserPasswordSchema = z.object({
  data: z.object({
    userId: z.string(),
    password: z.string(),
  }),
  trx: DatabaseTransactionSchema,
});
