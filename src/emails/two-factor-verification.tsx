import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

import { Tailwind } from "./components/tailwind";

interface TwoFactorVerificationProps {
  token: string;
}

export default function TwoFactorVerification({
  token = "596853",
}: TwoFactorVerificationProps) {
  return (
    <Html>
      <Head />
      <Preview>2FA Verification Code</Preview>
      <Tailwind>
        <Body className="m-0 bg-white font-sans">
          <Container className="m-x-auto m-y-0 p-5">
            <Section className="rounded-md bg-gray-200 p-8">
              <Section className="flex flex-col items-center rounded-md bg-white p-6">
                <Heading className="m-0 text-3xl font-bold">
                  2FA Verification Code
                </Heading>
                <Text className="mt-2">
                  To complete your login, please enter the following
                  verification code.
                </Text>

                <Section className="my-10 flex w-full items-center justify-center">
                  <Text className="m-0 text-center text-sm font-bold">
                    Verification code
                  </Text>

                  <Text className="my-2 text-center text-4xl font-bold tracking-wider">
                    {token}
                  </Text>
                  <Text className="m-0 text-center text-xs text-gray-500">
                    (This code is valid for 5 minutes)
                  </Text>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
