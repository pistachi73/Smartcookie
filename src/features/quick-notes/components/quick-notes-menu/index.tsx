"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  NoteAddIcon,
} from "@hugeicons-pro/core-solid-rounded";
import {
  ArrowLeft02Icon,
  StickyNote02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";
import { Button as RAButton } from "react-aria-components";
import { toast } from "sonner";
import { tv } from "tailwind-variants";

import { Button, buttonStyles } from "@/ui/button";
import { Link } from "@/ui/link";
import { Popover } from "@/ui/popover";
import { Skeleton } from "@/ui/skeleton";
import { Textarea } from "@/ui/textarea";
import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

import { useAddQuickNote } from "../../hooks/use-add-quick-note";
import { quickNotesHubsQueryOptions } from "../../lib/quick-notes-query-options";

type NoteFormState = {
  content: string;
  hubId: number | null;
};

const hubButtonStyles = tv({
  base: "p-2 ring-offset-overlay relative group cursor-pointer rounded-lg transition-colors justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
});

export const QuickNotesMenu = () => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedHub, setSelectedHub] = useState<number | null>(null);
  const [noteForm, setNoteForm] = useState<NoteFormState>({
    content: "",
    hubId: null,
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { data: hubs, isLoading: isLoadingHubs } = useQuery({
    ...quickNotesHubsQueryOptions,
    enabled: isPopoverOpen,
  });
  const { mutateAsync: addNoteAsync } = useAddQuickNote();

  const handleCreateNote = () => {
    if (!noteForm.content.trim() || noteForm.hubId === null) return;

    resetMenu();

    toast.promise(
      addNoteAsync({
        content: noteForm.content,
        hubId: noteForm.hubId,
        updatedAt: new Date().toISOString(),
      }),
      {
        duration: 3000,
        loading: "Adding note...",
        success: (data) => {
          return (
            <div className="flex items-center gap-2 justb">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  data-slot="icon"
                  className="text-success"
                />
                <p className="text-success">Note added successfully</p>
              </div>
              <Link
                intent="primary"
                className="ml-auto text-success hover:text-success/80"
                href={`/quick-notes?hubId=${noteForm.hubId}`}
              >
                View note
              </Link>
            </div>
          );
        },
        error: "Failed to add note",
      },
    );
  };

  const handleSelectHub = (hubId: number) => {
    setSelectedHub(hubId);
    setNoteForm((prev) => ({ ...prev, hubId }));
    setIsAddingNote(true);
  };

  const resetMenu = () => {
    setIsAddingNote(false);
    setSelectedHub(null);
    setNoteForm({ content: "", hubId: null });
  };

  const handleOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      setTimeout(() => {
        resetMenu();
      }, 500);
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange} isOpen={isPopoverOpen}>
      <Button
        intent="secondary"
        size="sq-sm"
        className="flex items-center gap-2 fixed bottom-4 left-4"
      >
        <HugeiconsIcon icon={NoteAddIcon} className="size-5" data-slot="icon" />
      </Button>

      <Popover.Content
        className={cn(
          "max-w-sm w-full overflow-hidden",
          "[--gutter:--spacing(4)]",
        )}
        showArrow={false}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isAddingNote ? (
            <m.div
              key="adding-note"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 40,
                mass: 0.8,
              }}
            >
              <Popover.Header>
                <Popover.Title className="flex items-center gap-2">
                  <Button
                    aria-label="Back to course selection"
                    intent="plain"
                    onPress={resetMenu}
                    className={"size-6"}
                    size="sq-xs"
                  >
                    <HugeiconsIcon icon={ArrowLeft02Icon} data-slot="icon" />
                  </Button>
                  <span className="line-clamp-1">
                    Add note to{" "}
                    {hubs?.find((hub) => hub.id === selectedHub)?.name}
                  </span>
                </Popover.Title>
              </Popover.Header>
              <Popover.Body className="py-4! sm:h-[300px]">
                <Textarea
                  value={noteForm.content}
                  onChange={(value) =>
                    setNoteForm((prev) => ({
                      ...prev,
                      content: value,
                    }))
                  }
                  autoFocus
                  placeholder="Enter your note here..."
                  className={{
                    textarea: "resize-none sm:text-base bg-overlay-highlight",
                  }}
                />
              </Popover.Body>
              <Popover.Footer>
                <Button onPress={handleCreateNote} className={"w-full"}>
                  <HugeiconsIcon icon={StickyNote02Icon} data-slot="icon" />
                  Save note
                </Button>
              </Popover.Footer>
            </m.div>
          ) : (
            <m.div
              key="hub-selection"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 40,
                mass: 0.8,
              }}
            >
              <Popover.Header title="Add Quick Notes" />
              <Popover.Body className=" gap-2 py-4! sm:h-[300px] overflow-y-auto">
                {isLoadingHubs
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton
                        data-testid="hub-skeleton"
                        key={`hub-skeleton-${index}`}
                        className="w-full h-8"
                      />
                    ))
                  : hubs?.map((hub) => {
                      const colorClasses = getCustomColorClasses(hub.color);

                      return (
                        <RAButton
                          key={hub.id}
                          onPress={() => handleSelectHub(hub.id)}
                          className={cn(
                            hubButtonStyles(),
                            colorClasses.focusVisible,
                            colorClasses.bg,
                            "text-left gap-2 hover:brightness-110 transition-all duration-200",
                          )}
                        >
                          {hub.name}
                        </RAButton>
                      );
                    })}
              </Popover.Body>
              <Popover.Footer>
                <Link
                  className={buttonStyles({
                    intent: "outline",
                    className: "w-full",
                  })}
                  href="/portal/quick-notes"
                >
                  <HugeiconsIcon
                    icon={StickyNote02Icon}
                    className="size-4"
                    data-slot="icon"
                  />
                  View all notes
                </Link>
              </Popover.Footer>
            </m.div>
          )}
        </AnimatePresence>
      </Popover.Content>
    </Popover>
  );
};
