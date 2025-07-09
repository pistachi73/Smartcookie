"use client";
import { updateUser } from "@/data-access/user/mutations";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { Card } from "@/ui/card";
import { Form } from "@/ui/form";
import { Switch } from "@/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fingerprint } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UpdateTFASchema } from "../../lib/validation";

export const UpdateTFA = () => {
  const user = useCurrentUser();
  const form = useForm<z.infer<typeof UpdateTFASchema>>({
    resolver: zodResolver(UpdateTFASchema),
    defaultValues: {
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
    },
    mode: "onChange",
  });

  const { mutate: updateTFA, isPending } = useProtectedMutation({
    schema: z.object({
      isTwoFactorEnabled: z.boolean(),
    }),
    mutationFn: ({ isTwoFactorEnabled }, { userId }) =>
      updateUser({ data: { isTwoFactorEnabled }, id: userId }),
    onSuccess: (_, input) => {
      toast.success(
        input.isTwoFactorEnabled
          ? "Two factor enable!"
          : "Two factor disabled!",
      );
    },
    onError: () => {
      toast.error("Something went wrong! Please try again.");
    },
  });

  if (user?.isOAuth) {
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
        <Card.Action className="row-span-2 h-full flex items-center justify-center">
          <Form>
            <Controller
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <Switch
                  isSelected={field.value}
                  onChange={(isSelected) => {
                    field.onChange(isSelected);
                    updateTFA({
                      isTwoFactorEnabled: isSelected,
                    });
                  }}
                  isDisabled={isPending}
                  className={"flex-row-reverse gap-2"}
                >
                  {field.value ? "Enabled" : "Disabled"}
                </Switch>
              )}
            />
          </Form>
        </Card.Action>
      </Card.Header>
    </Card>
  );
};
