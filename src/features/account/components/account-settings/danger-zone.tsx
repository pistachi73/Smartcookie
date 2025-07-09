"use client";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Modal } from "@/ui/modal";
import { TextField } from "@/ui/text-field";

import { deleteUser } from "@/data-access/user/mutations";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";
import {
  Alert01Icon,
  ArrowDown01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const DangerZone = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const { mutate: deleteUserMutation, isPending } = useProtectedMutation({
    schema: z.void(),
    mutationFn: () => deleteUser(),
    onSuccess: () => {
      signOut({ redirectTo: "/" });
    },
    onError: () => {
      toast.error("Something went wrong! Please try again.");
    },
  });

  const isDeleteEnabled = confirmationText === "DELETE";

  const handleModalClose = (isOpen: boolean) => {
    console.log("isOpen", isOpen);
    setIsAlertOpen(isOpen);
    if (!isOpen) {
      setConfirmationText("");
    }
  };

  return (
    <>
      <Card className={cn("py-2 gap-0 shadow-md overflow-hidden")}>
        <Card.Header
          className="cursor-pointer px-2 gap-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="cursor-pointer p-4 flex flex-row items-center justify-between hover:bg-muted transition-colors rounded-md">
            <Card.Title className="flex flex-row gap-2 items-center">
              <HugeiconsIcon icon={Alert01Icon} size={20} />
              Danger zone
            </Card.Title>
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
              className="flex flex-col gap-6"
            >
              <Card.Content className="pt-6">
                <p>
                  Permanently remove your Personal Account and all of its
                  contents from the Vercel platform. This action is not
                  reversible, so please continue with caution.
                </p>
              </Card.Content>
              <Card.Footer className="pb-4 ml-auto">
                <Button
                  size="small"
                  type="button"
                  intent="secondary"
                  onPress={() => setIsAlertOpen(true)}
                >
                  Remove account
                </Button>
              </Card.Footer>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      <Modal isOpen={isAlertOpen} onOpenChange={handleModalClose}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Are you absolutely sure?</Modal.Title>
            <Modal.Description>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </Modal.Description>
          </Modal.Header>
          <Modal.Body className="space-y-4 overflow-visible">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                To confirm, type <span className="font-semibold">DELETE</span>{" "}
                in the box below:
              </p>
              <TextField
                value={confirmationText}
                onChange={(value) => setConfirmationText(value)}
                placeholder="Type DELETE to confirm"
                isDisabled={isPending}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="sm:ml-auto">
            <Button data-slot="close" intent="secondary" isDisabled={isPending}>
              Cancel
            </Button>
            <Button
              intent="danger"
              onPress={() => deleteUserMutation()}
              isDisabled={isPending || !isDeleteEnabled}
            >
              Delete account
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};
