"use client";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useSafeAction } from "@/shared/hooks/use-safe-action";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Form } from "@/ui/form";
import { PasswordFieldWithValidation } from "@/ui/password-field-with-validation";
import { TextField } from "@/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown01Icon,
  LockKeyIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loader2, Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { updateUserPasswordAction } from "../actions";
import { UpdatePasswordSchema } from "../lib/validation";

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

  const { execute: updatePassword, isExecuting } = useSafeAction(
    updateUserPasswordAction,
    {
      onSuccess: () => {
        toast.success("Password updated!");
        form.reset();
      },
    },
  );

  if (user.isOAuth) {
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
    <Card className="shadow-md overflow-hidden">
      <Card.Header
        className="p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="p-4 flex flex-row gap-2 items-center justify-between hover:bg-accent/50 transition-colors rounded-md">
          <div className="space-y-1">
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
          >
            <Card.Content className="pt-0 space-y-6">
              <Form onSubmit={form.handleSubmit(updatePassword)}>
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
                        isDisabled={isExecuting}
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
                        isDisabled={isExecuting}
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
                        isDisabled={isExecuting}
                        errorMessage={fieldState.error?.message}
                      />
                    )}
                  />
                  <Card.Footer className="pt-4 px-0">
                    <div className="ml-auto">
                      <Button
                        size="small"
                        isDisabled={!form.formState.isDirty || isExecuting}
                        type="submit"
                      >
                        {isExecuting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save
                      </Button>
                    </div>
                  </Card.Footer>
                </div>
              </Form>
            </Card.Content>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
