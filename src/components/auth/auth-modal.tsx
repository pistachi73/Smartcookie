"use client";

import { AUTH_ROUTES } from "@/app-config";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { usePathname, useRouter } from "next/navigation";
import { Auth, type AuthSteps } from ".";

export const AuthModal = ({
  initialFormType,
}: { initialFormType?: AuthSteps }) => {
  const router = useRouter();
  const pathname = usePathname();

  const open = AUTH_ROUTES.some((route) => pathname.includes(route));

  if (!open) {
    return null;
  }

  return (
    <ResponsiveDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <ResponsiveDialogContent className="h-full  max-w-max sm:border-none sm:h-auto sm:w-auto  p-0 bg-background">
        <VisuallyHidden.Root>
          <ResponsiveDialogTitle>Authentication modal</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {initialFormType}
          </ResponsiveDialogDescription>
        </VisuallyHidden.Root>
        <Auth className="border-none" initialFormType={initialFormType} />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
