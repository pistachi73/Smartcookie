"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AccountSetting02Icon,
  ImageAdd02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Form } from "@/ui/form";
import { TextField } from "@/ui/text-field";
import { UserAvatar } from "@/ui/user-avatar";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { cn } from "@/shared/lib/classes";

import { updateUser } from "@/data-access/user/mutations";
import { UpdateNameSchema } from "../../lib/validation";

export const UpdateNameAvatar = () => {
  const session = useSession();
  const user = useCurrentUser();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameForm = useForm<z.infer<typeof UpdateNameSchema>>({
    resolver: zodResolver(UpdateNameSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  const { mutate: updateUserMutation, isPending: isUpdatingName } =
    useProtectedMutation({
      schema: z.object({
        name: z.string().min(1),
      }),
      mutationFn: ({ name }, { userId }) =>
        updateUser({ id: userId, data: { name } }),
      onSuccess: () => {
        toast.success("Name updated successfully!");
        session.update();
      },
      onError: () => {
        toast.error("Failed to update name!");
      },
    });

  const onSubmit = async (values: z.infer<typeof UpdateNameSchema>) => {
    updateUserMutation({ name: values.name });
  };

  return (
    <Card className="shadow-md relative overflow-hidden">
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary w-full h-1" />
      <Card.Header>
        <Card.Title className="flex flex-row gap-2 items-center">
          <HugeiconsIcon icon={AccountSetting02Icon} size={20} />
          Personal Information
        </Card.Title>
      </Card.Header>
      <Card.Content className="pt-0 space-y-6">
        <div className="flex flex-row gap-4 items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group mx-auto"
          >
            <UserAvatar
              userImage={user?.image}
              userName={user?.name}
              className="size-28 *:text-[24px]"
            />
            <div
              className={cn(
                "w-full h-full absolute opacity-0 transition-all",
                "top-0 left-0 z-0 flex items-center justify-center rounded-full",
                "bg-fg px-2 py-1 text-xs font-medium text-white",
                "group-hover:opacity-100",
              )}
            >
              <HugeiconsIcon
                icon={ImageAdd02Icon}
                size={22}
                className="scale-50 group-hover:scale-100 transition-transform"
              />
            </div>
          </button>
          <input type="file" ref={fileInputRef} className="hidden" />
        </div>
        <Form onSubmit={nameForm.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Controller
              control={nameForm.control}
              name="name"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Name"
                  autoComplete="name"
                  className={{ input: "text-sm" }}
                  isDisabled={isUpdatingName}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
            <Card.Footer className="pt-4 px-0">
              <div className="ml-auto">
                <Button
                  isDisabled={!nameForm.formState.isDirty || isUpdatingName}
                  type="submit"
                >
                  {isUpdatingName && (
                    <ProgressCircle isIndeterminate className="size-4" />
                  )}
                  Save
                </Button>
              </div>
            </Card.Footer>
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
};
