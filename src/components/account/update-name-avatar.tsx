"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSafeAction } from "@/hooks/use-safe-action";
import { cn } from "@/lib/utils";
import { AccountSetting02Icon, ImageAdd02Icon } from "@hugeicons/react";
import { useSession } from "next-auth/react";
import { updateUserNameAction } from "./actions";
import { UpdateNameSchema } from "./validation";

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
  const { execute: updateUserName, isExecuting: isUpdatingName } =
    useSafeAction(updateUserNameAction, {
      onSuccess: () => {
        toast.success("Name updated successfully!");
        session.update();
      },
    });

  const onSubmit = async (values: z.infer<typeof UpdateNameSchema>) => {
    updateUserName(values);
  };

  return (
    <Card className="shadow-md relative overflow-hidden">
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary w-full h-1" />
      <CardHeader>
        <CardTitle className="flex flex-row gap-2 text-xl items-center">
          <AccountSetting02Icon size={20} />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative group"
        >
          <UserAvatar
            userImage={user?.image}
            userName={user?.name}
            className="w-28 h-28 text-xl"
          />
          <div
            className={cn(
              "w-full h-full absolute opacity-0 transition-all",
              "top-0 left-0 z-0 flex items-center justify-center rounded-full",
              "bg-primary-800 px-2 py-1 text-xs font-medium text-white",
              "group-hover:bg-primary-800",
              "group-hover:opacity-100",
            )}
          >
            <ImageAdd02Icon
              size={18}
              className="scale-50 group-hover:scale-100 transition-transform"
            />
          </div>
        </button>
        <input type="file" ref={fileInputRef} className="hidden" />
        <Form {...nameForm}>
          <form
            onSubmit={nameForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={nameForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="max-w-[500px]">
                  <FormLabel className="block">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="name"
                      className="text-sm"
                      disabled={isUpdatingName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex flex-row items-center justify-end">
              <Button
                size={"sm"}
                isDisabled={!nameForm.formState.isDirty || isUpdatingName}
                type="submit"
              >
                {isUpdatingName && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
