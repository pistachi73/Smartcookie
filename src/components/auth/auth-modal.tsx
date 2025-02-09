"use client";

import { AUTH_ROUTES } from "@/app-config";
import { usePathname, useRouter } from "next/navigation";
import { Auth } from ".";
import { Modal, VisuallyHidden } from "../ui/new/ui";

export const AuthModal = () => {
  const router = useRouter();
  const pathname = usePathname();

  const open = AUTH_ROUTES.some((route) => pathname.includes(route));

  if (!open) {
    return null;
  }

  return (
    <Modal.Content
      size="5xl"
      isOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
      isBlurred
      classNames={{
        content: "h-full  max-w-max sm:border-none sm:h-auto sm:w-auto p-0",
      }}
    >
      <VisuallyHidden>
        <Modal.Title>Authentication modal</Modal.Title>
      </VisuallyHidden>
      <Modal.Body className="p-0!">
        <Auth className="border-none" />
      </Modal.Body>
    </Modal.Content>
  );
};
