"use client";

import { updateUserAccountEmail } from "@/data-access/auth/mutations";
import { isDataAccessError } from "@/data-access/errors";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Form } from "@/ui/form";
import { InputOTP } from "@/ui/input-otp";
import { TextField } from "@/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailAtSign02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { UpdateEmailSchema } from "../../lib/validation";
import { ResendVerificationEmailButton } from "./resend-verification-email-button";

export const UpdateEmail = () => {
  const user = useCurrentUser();
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const form = useForm<z.infer<typeof UpdateEmailSchema>>({
    resolver: zodResolver(UpdateEmailSchema),
    defaultValues: {
      newEmail: user?.email ?? "",
      verificationToken: "",
    },
  });

  // Reset verification token when switching to verification mode
  useEffect(() => {
    if (isVerifyingEmail) {
      form.setValue("verificationToken", "", { shouldValidate: false });
    }
  }, [isVerifyingEmail, form]);

  const { mutate: updateUserEmailMutation, isPending } = useProtectedMutation({
    schema: UpdateEmailSchema,
    mutationFn: updateUserAccountEmail,
    onSuccess: (data) => {
      if (isDataAccessError(data)) {
        switch (data.type) {
          case "DUPLICATE_RESOURCE":
            // Don't reveal if email exists - treat as success
            setIsVerifyingEmail(true);
            toast.success("Verification code sent to your email! Dup");
            break;
          case "NOT_FOUND":
            toast.error("User not found!");
            break;
          case "EMAIL_MUST_BE_DIFFERENT":
            toast.error("Email must be different!");
            form.setError("newEmail", {
              message: "Email must be different!",
            });
            break;
          case "EMAIL_SENDING_FAILED":
            toast.error("Failed to send verification email!");
            break;
          default:
            toast.error(data.message);
            break;
        }
        return;
      }

      if (data.verifyEmail) {
        setIsVerifyingEmail(true);
        toast.success("Verification code sent to your email!");
      } else {
        toast.success("Email updated successfully");
        form.setValue("verificationToken", "");
        setIsVerifyingEmail(false);
      }
    },
  });

  const onSubmit = (data: z.infer<typeof UpdateEmailSchema>) => {
    updateUserEmailMutation({
      newEmail: data.newEmail,
      verificationToken: isVerifyingEmail ? data.verificationToken : undefined,
    });
  };

  if (user?.isOAuth) {
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
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="shadow-md">
        <Card.Header>
          <Card.Title className="flex flex-row gap-2 items-center">
            <HugeiconsIcon icon={MailAtSign02Icon} size={20} />
            Email
          </Card.Title>
          <Card.Description>
            {isVerifyingEmail
              ? "Enter the code sent to your new email!"
              : "Enter the email addresses you want to use to log to SmartCookie."}
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-6">
          {isVerifyingEmail ? (
            <Controller
              key="verification-token"
              control={form.control}
              name="verificationToken"
              render={({ field, fieldState }) => (
                <div className="w-fit">
                  <div className="mb-2">
                    <InputOTP
                      aria-label="Verification code"
                      maxLength={6}
                      autoFocus
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    >
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
                    isUpdatingEmail={isPending}
                    email={form.getValues("newEmail")}
                  />
                </div>
              )}
            />
          ) : (
            <Controller
              control={form.control}
              name="newEmail"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  aria-label="Email"
                  value={form.getValues("newEmail")}
                  autoComplete="email"
                  className={{ input: "text-sm" }}
                  isDisabled={isPending}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          )}
        </Card.Content>
        <Card.Footer className="flex flex-row gap-2 ml-auto">
          {isVerifyingEmail && (
            <Button
              type="button"
              intent="secondary"
              isDisabled={isPending}
              onPress={() => setIsVerifyingEmail(false)}
            >
              Back
            </Button>
          )}
          <Button
            isDisabled={!form.formState.isDirty || isPending}
            type="submit"
          >
            {isPending && <ProgressCircle isIndeterminate className="size-4" />}
            {isVerifyingEmail ? "Verify email" : "Save"}
          </Button>
        </Card.Footer>
      </Card>
    </Form>
  );
};
