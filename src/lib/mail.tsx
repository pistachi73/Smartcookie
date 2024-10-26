"use server";
import { Resend } from "resend";

import PasswordReset from "@/emails/password-reset";
import TwoFactorVerification from "@/emails/two-factor-verification";
import VerifyEmail from "@/emails/verify-email";
import { env } from "@/env";
import { getUrl } from "@/utils/get-url";
const resend = new Resend(env.RESEND_API_KEY);
const emailFrom = env.EMAIL_FROM || "onboarding@resend.dev";

export const sendVerificationEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "Confirm your email",
    react: <VerifyEmail token={token} />,
  });
};

export const sendPasswordResetEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const resetLink = getUrl(`/reset-password?token=${token}`);
  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "Reset your password",
    react: <PasswordReset resetLink={resetLink} />,
  });
};

export const sendTwoFactorTokenEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "2FA Code",
    react: <TwoFactorVerification token={token} />,
  });
};
