"use server";
import { Resend } from "resend";

import PasswordReset from "@/emails/password-reset";
import TwoFactorVerification from "@/emails/two-factor-verification";
import VerifyEmail from "@/emails/verify-email";
import { env } from "@/env";
import { getUrl } from "@/shared/lib/get-url";
const resend = new Resend(env.RESEND_API_KEY);
const emailFrom = env.EMAIL_FROM || "SmartCookie <noreply@smartcookieapp.com>";

export const sendVerificationEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  await resend.emails.send({
    from: "SmartCookie Team <noreply@smartcookieapp.com>",
    to: email,
    subject: "Welcome to SmartCookie! Confirm your email address",
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
    from: "SmartCookie Security <noreply@smartcookieapp.com>",
    to: email,
    subject: "Reset your SmartCookie password",
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
    from: "SmartCookie 2FA <noreply@smartcookieapp.com>",
    to: email,
    subject: "Your SmartCookie security code",
    react: <TwoFactorVerification token={token} />,
  });
};
