"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  LockKeyIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Form } from "@/ui/form";
import { PasswordFieldWithValidation } from "@/ui/password-field-with-validation";
import { TextField } from "@/ui/text-field";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";

import { updateUserAccountPassword } from "@/data-access/auth/mutations";
import { UpdateUserAccountPasswordSchema } from "@/data-access/auth/schemas";
import { isDataAccessError } from "@/data-access/errors";
import { UpdatePasswordSchema } from "../../lib/validation";

export const UpdatePassword = () => {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { mutate: updateUserAccountPasswordMutation, isPending } =
    useProtectedMutation({
      schema: UpdateUserAccountPasswordSchema,
      mutationFn: updateUserAccountPassword,
      onSuccess: (data) => {
        if (isDataAccessError(data)) {
          switch (data.type) {
            case "INVALID_LOGIN":
              toast.error("Incorrect password!");
              form.setError("currentPassword", {
                message: "Incorrect password!",
              });
              break;
            default:
              toast.error("Something went wrong! Please try again.");
          }
        } else {
          toast.success("Password updated!");
          form.reset();
        }
      },
    });

  const onSubmit = (data: z.infer<typeof UpdatePasswordSchema>) => {
    updateUserAccountPasswordMutation({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  if (user?.isOAuth) {
    return (
      <Card className="shadow-md overflow-hidden bg-accent/50">
        <Card.Header className="p-2">
          <div className="p-4 flex flex-row gap-2 items-center justify-between">
            <div className="space-y-1">
              <Card.Title className="flex flex-row gap-2 items-center">
                <Lock className="w-5 h-5" />
                Security
              </Card.Title>
              <Card.Description>
                Can't change password because you are logged in with OAuth.
              </Card.Description>
            </div>
          </div>
        </Card.Header>
      </Card>
    );
  }

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="shadow-md overflow-hidden pt-2 pb-2 gap-0">
        <Card.Header
          className="cursor-pointer px-2 gap-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="cursor-pointer p-4 flex flex-row items-center justify-between hover:bg-muted transition-colors rounded-md">
            <div className="space-y-2">
              <Card.Title className="flex flex-row gap-2 items-center">
                <HugeiconsIcon icon={LockKeyIcon} size={20} />
                Security
              </Card.Title>
              <Card.Description>
                Change your password to keep your account secure.
              </Card.Description>
            </div>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={20}
              className={cn("transition-transform", isOpen && "rotate-180")}
            />
          </div>
        </Card.Header>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={regularSpring}
              className="flex flex-col gap-6"
            >
              <Card.Content className="space-y-6 pt-6">
                <div className="space-y-6">
                  <Controller
                    control={form.control}
                    name="currentPassword"
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="password"
                        isRevealable={true}
                        label="Current password"
                        autoComplete="current-password"
                        className={{ input: "text-sm" }}
                        isDisabled={isPending}
                        autoFocus
                        errorMessage={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="newPassword"
                    render={({ field, fieldState }) => (
                      <PasswordFieldWithValidation
                        {...field}
                        label="New password"
                        autoComplete="new-password"
                        showValidation={
                          form.formState.dirtyFields.newPassword ||
                          form.formState.errors.newPassword !== undefined
                        }
                        isDisabled={isPending}
                        errorMessage={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="password"
                        isRevealable={true}
                        label="Confirm password"
                        autoComplete="confirm-password"
                        isDisabled={isPending}
                        errorMessage={fieldState.error?.message}
                      />
                    )}
                  />
                </div>
              </Card.Content>
              <Card.Footer className="pb-4">
                <div className="ml-auto">
                  <Button
                    isDisabled={!form.formState.isDirty || isPending}
                    type="submit"
                  >
                    {isPending && (
                      <ProgressCircle isIndeterminate className="size-4" />
                    )}
                    Save
                  </Button>
                </div>
              </Card.Footer>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </Form>
  );
};
