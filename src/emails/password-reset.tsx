import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

import { Tailwind } from "./components/tailwind";

interface PasswordResetProps {
  resetLink: string;
}

export default function PasswordReset({
  resetLink = "https://example.com/reset-password?token=596853",
}: PasswordResetProps) {
  return (
    <Html>
      <Head />
      <Preview>Password Reset</Preview>
      <Tailwind>
        <Body className="m-0 bg-white font-sans">
          <Container className="m-x-auto m-y-0 p-5">
            <Section className="rounded-md bg-gray-200 p-8">
              <Section className="flex flex-col items-center rounded-md bg-white p-6">
                <Heading className="m-0 text-3xl font-bold">
                  Password Reset
                </Heading>
                <Text className="mt-2">
                  If you have requested to reset your password, please click the
                  button below. If you did not request a password reset, please
                  ignore this email and go to the site.
                </Text>

                <Section className="my-10 flex w-full flex-col items-center justify-center ">
                  <Link
                    className="block rounded-md bg-orange-600 bg-primary-foreground p-4 text-center font-medium text-white hover:bg-orange-700"
                    href={resetLink}
                  >
                    Click here to reset your password
                  </Link>
                  <Text className="mt-2 text-center text-xs text-gray-500">
                    (This code is valid for 5 minutes)
                  </Text>
                  <Link
                    className="mt-2 block rounded-md border-black bg-primary-foreground p-4 text-center font-medium  text-black "
                    href="https://example.com/"
                  >
                    Go to site
                  </Link>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
