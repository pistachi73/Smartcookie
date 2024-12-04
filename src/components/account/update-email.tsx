"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeInput } from "@/components/ui/code-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSafeAction } from "@/hooks/use-safe-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailAtSign02Icon } from "@hugeicons/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { updateUserEmailAction } from "./actions";
import { ResendVerificationEmailButton } from "./resent-verification-email-button";
import { UpdateEmailSchema } from "./validation";

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
        <CardHeader className="p-2">
          <div className="p-4 flex flex-row gap-2 items-center justify-between ">
            <div className="space-y-1">
              <CardTitle className="flex flex-row gap-2 text-xl items-center">
                <MailAtSign02Icon className="w-5 h-5" />
                Email
              </CardTitle>
              <CardDescription>
                Can't change email because you are logged in with OAuth.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          <Input
            value={user?.email ?? ""}
            className="text-sm max-w-[500px]"
            disabled
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2 text-xl items-center">
          <MailAtSign02Icon className="w-5 h-5" />
          Email
        </CardTitle>
        <CardDescription>
          {isVerifyingEmail
            ? "Enter the code sent to your new email!"
            : "Enter the email addresses you want to use to log in with OH."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updateUserEmail)}
            className="space-y-4"
          >
            {isVerifyingEmail ? (
              <FormField
                control={form.control}
                name="verificationToken"
                render={({ field }) => (
                  <FormItem className="w-fit">
                    <FormControl>
                      <CodeInput
                        {...field}
                        length={6}
                        autoFocus
                        disabled={isUpdatingEmail}
                      />
                    </FormControl>
                    <ResendVerificationEmailButton
                      isUpdatingEmail={isUpdatingEmail}
                      email={form.getValues("email")}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="max-w-[500px]">
                    <FormControl>
                      <Input
                        {...field}
                        value={form.getValues("email")}
                        autoComplete="email"
                        className="text-sm"
                        disabled={isUpdatingEmail}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="w-full flex flex-row items-center justify-end gap-1">
              {isVerifyingEmail && (
                <Button
                  size="sm"
                  variant="ghost"
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
                size="sm"
              >
                {isUpdatingEmail && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isVerifyingEmail ? "Verify email" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
