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

interface VerifyEmailProps {
  token: string;
}

export default function VerifyEmail({ token = "596853" }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Email Verification</Preview>
      <Tailwind>
        <Body className="m-0 bg-white font-sans">
          <Container className="m-x-auto m-y-0 p-5">
            <Section className="rounded-md bg-gray-200 p-8">
              <Section className="flex flex-col items-center rounded-md bg-white p-6">
                <Text className="m-0 font-medium text-gray-400">
                  YOUR&apos;RE ONE STEP AWAY
                </Text>
                <Heading className="m-0 text-3xl font-bold">
                  Verify your email address
                </Heading>
                <Text className="mt-2">
                  To complete your registration, please enter the following
                  verification code in the registration form.
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
