"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSafeAction } from "@/hooks/use-safe-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fingerprint } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { updateTFAAction } from "./actions";
import { UpdateTFASchema } from "./validation";

export const UpdateTFA = () => {
  const user = useCurrentUser();
  const form = useForm<z.infer<typeof UpdateTFASchema>>({
    resolver: zodResolver(UpdateTFASchema),
    defaultValues: {
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
    },
    mode: "onChange",
  });

  const { execute: updateTFA, isExecuting } = useSafeAction(updateTFAAction, {
    onSuccess: ({ input }) => {
      toast.success(
        input.isTwoFactorEnabled
          ? "Two factor enable!"
          : "Two factor disabled!",
      );
    },
  });

  if (user.isOAuth) {
    return (
      <Card className="shadow-md overflow-hidden bg-accent/50">
        <CardHeader className="p-2">
          <div className="p-4 flex flex-row gap-2 items-center justify-between ">
            <div className="space-y-1">
              <CardTitle className="flex flex-row gap-2 text-xl items-center">
                <Fingerprint className="w-5 h-5" />
                Two factor authentication
              </CardTitle>
              <CardDescription>
                Can't enable two factor authentication because you are logged in
                with OAuth.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-md overflow-hidden p-2">
      <Form {...form}>
        <form className="shrink-0">
          <FormField
            control={form.control}
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <FormItem className="p-4 flex flex-row items-center w-full justify-between">
                <div className="space-y-1 shrink-0 basis-auto">
                  <FormLabel className="flex flex-row gap-2 text-xl items-center cursor-pointer">
                    <Fingerprint className="w-5 h-5" />
                    Two factor authentication
                  </FormLabel>
                  <FormDescription>
                    Enable two factor authentication for more security
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      field.onChange(value);
                      updateTFA({ isTwoFactorEnabled: value });
                    }}
                    disabled={isExecuting}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Card>
  );
};
