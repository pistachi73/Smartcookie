import { useSafeAction } from "@/hooks/use-safe-action";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { createEventAction, editNonRecurrentEventAction } from "../actions";
import { mapDBOccurrencesToCalendarEvents } from "./utils";

export const useSubmitOccurrenceForm = () => {
  const {
    updateOccurrences,
    clearEditingEventOccurrence,
    clearDraftEventOccurrence,
    setActiveSidebar,
  } = useCalendarStore(
    useShallow(
      ({
        updateOccurrences,
        setActiveSidebar,
        addEventOccurrences,
        removeEventOccurreces,
        clearEditingEventOccurrence,
        clearDraftEventOccurrence,
      }) => ({
        updateOccurrences,
        setActiveSidebar,
        addEventOccurrences,
        removeEventOccurreces,
        clearEditingEventOccurrence,
        clearDraftEventOccurrence,
      }),
    ),
  );

  const onMutationSuccess = () => {
    clearEditingEventOccurrence();
    clearDraftEventOccurrence();
    setActiveSidebar("main");
  };

  const { mutate: createEvent, isPending: isCreatingEvent } = useMutation({
    mutationFn: createEventAction,
    onSuccess: (output) => {
      onMutationSuccess();
      if (!output?.data) {
        return;
      }

      updateOccurrences(
        mapDBOccurrencesToCalendarEvents({
          event: output.data.createdEvent,
          occurrences: output.data.createdOccurrences,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    execute: editNonRecurrentEvent,
    isPending: isEditingNonRecurrentEvent,
  } = useSafeAction(editNonRecurrentEventAction, {
    onSuccess: (output) => {
      console.log({ output });
      if (!output?.data) {
        return;
      }

      updateOccurrences(
        mapDBOccurrencesToCalendarEvents({
          event: output.data.updatedEvent,
          occurrences: output.data.updatedOccurrences,
        }),
      );
      onMutationSuccess();
      toast.success("Event updated successfully!");
      onMutationSuccess();
    },
  });

  return {
    createEvent,
    editNonRecurrentEvent,
    isPending: isCreatingEvent || isEditingNonRecurrentEvent,
  };
};
