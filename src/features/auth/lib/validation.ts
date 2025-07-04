import * as z from "zod";

export const passwordRegex = [
  {
    id: "lowercase",
    regex: /(?=.*[a-z])/,
    message: "At least 1 lowercase letter",
  },
  {
    id: "uppercase",
    regex: /(?=.*[A-Z])/,
    message: "At least 1 uppercase letter",
  },
  {
    id: "number",
    regex: /(?=.*[0-9])/,
    message: "At least 1 number",
  },
  {
    id: "length",
    regex: /(?=.{8,})/,
    message: "At least 8 characters",
  },
] as const;

export const PasswordSchema = z
  .string()
  .regex(passwordRegex[0].regex, { message: passwordRegex[0].message })
  .regex(passwordRegex[1].regex, { message: passwordRegex[1].message })
  .regex(passwordRegex[2].regex, { message: passwordRegex[2].message })
  .regex(passwordRegex[3].regex, { message: passwordRegex[3].message });

export const authSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  loginPassword: z.string().min(1, { message: "Password is required" }),
  registerPassword: PasswordSchema,
  registerPasswordConfirm: z.string(),
  code: z.string(),
});

export type AuthSchema = z.infer<typeof authSchema>;

export type AuthSteps =
  | "LANDING"
  | "VERIFY_EMAIL"
  | "OAUTH"
  | "CREATE_PASSWORD"
  | "CONFIRM_PASSWORD"
  | "ENTER_PASSWORD"
  | "TWO_FACTOR"
  | "RESET_PASSWORD"
  | "UPDATE_PASSWORD";
