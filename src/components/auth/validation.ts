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

export const SignInSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const ResetpasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewVerificationSchema = z.object({
  code: z.string().min(6, { message: "Code is required" }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: PasswordSchema,
  emailVerificationCode: z.optional(z.string()),
});

export const SettingsSchema = z
  .object({
    name: z.string().optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    email: z.string().email().optional(),
    verifycationToken: z.string().optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
    currentPassword: z.string().optional(),
    password: PasswordSchema.optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.confirmPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      path: ["currentPassword"],
      message: "Current password is required!",
    },
  )
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });

export const AuthRegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: PasswordSchema,
  code: z.string().optional(),
});

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
