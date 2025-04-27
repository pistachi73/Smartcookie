import { useSafeAction } from "@/shared/hooks/use-safe-action";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createEventAction, editNonRecurrentEventAction } from "../../actions";

export const useSubmitOccurrenceForm = () => {
  const onMutationSuccess = () => {
    // setEdittedOccurrenceId(undefined);
    // removeOccurrences(-1, { silent: true });
  };

  const { mutate: createEvent, isPending: isCreatingEvent } = useMutation({
    mutationFn: createEventAction,
    onSuccess: (output) => {
      onMutationSuccess();
      if (!output?.data) {
        return;
      }

      // updateOccurrences(
      //   mapDBOccurrencesToCalendarEvents({
      //     event: output.data.createdEvent,
      //     occurrences: output.data.createdOccurrences,
      //   }),
      // );
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

      // updateOccurrences(
      //   mapDBOccurrencesToCalendarEvents({
      //     event: output.data.updatedEvent,
      //     occurrences: output.data.updatedOccurrences,
      //   }),
      // );
      onMutationSuccess();
      toast.success("Event updated successfully!");
    },
  });

  return {
    createEvent,
    editNonRecurrentEvent,
    isPending: isCreatingEvent || isEditingNonRecurrentEvent,
  };
};
