"use client";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useSafeAction } from "@/shared/hooks/use-safe-action";
import { Card } from "@/ui/card";
import { Form } from "@/ui/form";
import { Switch } from "@/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fingerprint } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { updateTFAAction } from "../actions";
import { UpdateTFASchema } from "../lib/validation";

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
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5" />
            Two factor authentication
          </Card.Title>
          <Card.Description>
            Can't enable two factor authentication because you are logged in
            with OAuth.
          </Card.Description>
        </Card.Header>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <Fingerprint className="w-5 h-5" />
          Two factor authentication
        </Card.Title>
        <Card.Description>
          Enable two factor authentication for more security
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Form>
          <Controller
            control={form.control}
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <Switch
                  isSelected={field.value}
                  onChange={(isSelected) => {
                    field.onChange(isSelected);
                    updateTFA({ isTwoFactorEnabled: isSelected });
                  }}
                  isDisabled={isExecuting}
                >
                  {field.value ? "Enabled" : "Disabled"}
                </Switch>
              </div>
            )}
          />
        </Form>
      </Card.Content>
    </Card>
  );
};
