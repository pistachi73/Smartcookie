"use client";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <CardHeader className="p-2" onClick={() => setIsOpen(!isOpen)}>
          <div className="p-4 flex flex-row gap-2 items-center justify-between cursor-pointer hover:bg-destructive/10 transition-colors rounded-md ">
            <CardTitle className="flex flex-row gap-2 text-xl items-center">
              <Alert01Icon size={20} />
              Danger zone
            </CardTitle>
            <ArrowDown01Icon
              className={cn("transition-transform", isOpen && "rotate-180")}
            />
          </div>
        </CardHeader>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={regularSpring}
            >
              <CardContent className="p-6 pt-0 space-y-6">
                <p>
                  Permanently remove your Personal Account and all of its
                  contents from the Vercel platform. This action is not
                  reversible, so please continue with caution.
                </p>
                <div className="w-full flex flex-row items-center justify-end">
                  <Button
                    size={"sm"}
                    type="button"
                    variant={"destructive"}
                    onClick={() => setIsAlertOpen(true)}
                  >
                    Remove account
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      <ResponsiveDialog
        open={isAlertOpen}
        onOpenChange={(open) => setIsAlertOpen(open)}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader className="text-balance">
            <ResponsiveDialogTitle className="text-xl">
              Are you absolutely sure?
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription className="text-base">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <Button
              variant={"destructive"}
              onClick={() => deleteUser()}
              disabled={isExecuting}
            >
              Delete account
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
};
