"use client";
import { Button } from "@/components/ui/new/ui/button";
import { Card } from "@/components/ui/new/ui/card";
import { Modal } from "@/components/ui/new/ui/modal";

import { useSafeAction } from "@/hooks/use-safe-action";
import { cn } from "@/lib/utils";
import { regularSpring } from "@/utils/animation";
import { Alert01Icon, ArrowDown01Icon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { deleteUserAction } from "./actions";

export const DangerZone = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { execute: deleteUser, isExecuting } = useSafeAction(deleteUserAction, {
    onSuccess: () => {
      signOut({ redirectTo: "/" });
    },
  });

  return (
    <>
      <Card
        className={cn(
          "shadow-md overflow-hidden border border-destructive transition-colors",
          isOpen && "bg-destructive/10",
        )}
      >
        <Card.Header
          className="p-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="p-4 flex flex-row gap-2 items-center justify-between hover:bg-destructive/10 transition-colors rounded-md">
            <Card.Title className="flex flex-row gap-2 items-center">
              <Alert01Icon size={20} />
              Danger zone
            </Card.Title>
            <ArrowDown01Icon
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
                <p>
                  Permanently remove your Personal Account and all of its
                  contents from the Vercel platform. This action is not
                  reversible, so please continue with caution.
                </p>
                <div className="w-full flex flex-row items-center justify-end">
                  <Button
                    size="small"
                    type="button"
                    intent="danger"
                    onPress={() => setIsAlertOpen(true)}
                  >
                    Remove account
                  </Button>
                </div>
              </Card.Content>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      <Modal isOpen={isAlertOpen}>
        <Modal.Content
          isDismissable={true}
          onOpenChange={(isOpen) => setIsAlertOpen(isOpen)}
        >
          <Modal.Header>
            <Modal.Title>Are you absolutely sure?</Modal.Title>
            <Modal.Description>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </Modal.Description>
          </Modal.Header>
          <Modal.Footer>
            <Button
              intent="danger"
              onPress={() => deleteUser()}
              isDisabled={isExecuting}
            >
              Delete account
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};
