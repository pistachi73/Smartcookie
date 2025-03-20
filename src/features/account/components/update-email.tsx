"use client";

import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useSafeAction } from "@/shared/hooks/use-safe-action";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Form } from "@/ui/form";
import { InputOTP } from "@/ui/input-otp";
import { TextField } from "@/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailAtSign02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { updateUserEmailAction } from "../actions";
import { UpdateEmailSchema } from "../lib/validation";
import { ResendVerificationEmailButton } from "./resent-verification-email-button";

export const UpdateEmail = () => {
  const user = useCurrentUser();
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const form = useForm<z.infer<typeof UpdateEmailSchema>>({
    resolver: zodResolver(UpdateEmailSchema),
    defaultValues: {
      email: user?.email ?? "",
      verificationToken: "",
    },
  });

  const { execute: updateUserEmail, isExecuting: isUpdatingEmail } =
    useSafeAction(updateUserEmailAction, {
      onSuccess: ({ data, input }) => {
        console.log("data", data, input);
        if (data?.verifyEmail) {
          setIsVerifyingEmail(true);
          toast.success("Verification code sent to your email!");
        } else {
          toast.success("Email updated successfully");
          setIsVerifyingEmail(false);
        }
      },
    });

  if (user.isOAuth) {
    return (
      <Card className="shadow-md overflow-hidden bg-accent/50">
        <Card.Header className="p-2">
          <div className="p-4 flex flex-row gap-2 items-center justify-between">
            <div className="space-y-1">
              <Card.Title className="flex flex-row gap-2 items-center">
                <HugeiconsIcon icon={MailAtSign02Icon} className="w-5 h-5" />
                Email
              </Card.Title>
              <Card.Description>
                Can't change email because you are logged in with OAuth.
              </Card.Description>
            </div>
          </div>
        </Card.Header>
        <Card.Content className="pt-0 space-y-6">
          <TextField
            value={user?.email ?? ""}
            className={{ input: "text-sm" }}
            isDisabled
          />
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <Card.Header>
        <Card.Title className="flex flex-row gap-2 items-center">
          <HugeiconsIcon icon={MailAtSign02Icon} className="w-5 h-5" />
          Email
        </Card.Title>
        <Card.Description>
          {isVerifyingEmail
            ? "Enter the code sent to your new email!"
            : "Enter the email addresses you want to use to log in with OH."}
        </Card.Description>
      </Card.Header>
      <Card.Content className="pt-0 space-y-6">
        <Form onSubmit={form.handleSubmit(updateUserEmail)}>
          <div className="space-y-4">
            {isVerifyingEmail ? (
              <Controller
                control={form.control}
                name="verificationToken"
                render={({ field, fieldState }) => (
                  <div className="w-fit">
                    <div className="mb-2">
                      <InputOTP maxLength={6} autoFocus {...field}>
                        <InputOTP.Group>
                          <InputOTP.Slot index={0} />
                          <InputOTP.Slot index={1} />
                          <InputOTP.Slot index={2} />
                          <InputOTP.Slot index={3} />
                          <InputOTP.Slot index={4} />
                          <InputOTP.Slot index={5} />
                        </InputOTP.Group>
                      </InputOTP>
                    </div>
                    {fieldState.error?.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                    <ResendVerificationEmailButton
                      isUpdatingEmail={isUpdatingEmail}
                      email={form.getValues("email")}
                    />
                  </div>
                )}
              />
            ) : (
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    value={form.getValues("email")}
                    autoComplete="email"
                    className={{ input: "text-sm" }}
                    isDisabled={isUpdatingEmail}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            )}
            <Card.Footer className="pt-4 px-0">
              <div className="ml-auto flex items-center gap-1">
                {isVerifyingEmail && (
                  <Button
                    size="small"
                    type="button"
                    isDisabled={isUpdatingEmail}
                    onPress={() => setIsVerifyingEmail(false)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  isDisabled={!form.formState.isDirty || isUpdatingEmail}
                  type="submit"
                  size="small"
                >
                  {isUpdatingEmail && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isVerifyingEmail ? "Verify email" : "Save"}
                </Button>
              </div>
            </Card.Footer>
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
};
