"use client";

import { AUTH_ROUTES } from "@/app-config";
import { usePathname, useRouter } from "next/navigation";
import { Auth } from ".";
import { Modal, VisuallyHidden } from "../ui/new/ui";
import type { AuthSteps } from "./validation";

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
    <Modal
      isOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <Modal.Content
        isBlurred
        classNames={{
          content: "h-full  max-w-max sm:border-none sm:h-auto sm:w-auto  p-0",
        }}
      >
        <VisuallyHidden>
          <Modal.Title>Authentication modal</Modal.Title>
          <Modal.Description>{initialFormType}</Modal.Description>
        </VisuallyHidden>
        <Modal.Body className="">
          <Auth className="border-none" />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
