// import { useSafeAction } from "@/hooks/use-safe-action";
// import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
// import { PublicError } from "@/use-cases/errors";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import type { z } from "zod";
// import { useShallow } from "zustand/react/shallow";
// import { editNonRecurrentEventAction } from "../actions";
// import type { SessionOcurrenceFormSchema } from "./schema";
// import {
//   buildEventOccurrencesData,
//   formatCalendarEventOcurrences,
// } from "./utils";

// export const useEditNonRecurrentEvent = () => {
//   const {
//     updateEventOccurrences,
//     clearEditingEventOccurrence,
//     clearDraftEventOccurrence,
//     eventOccurrences,
//     setActiveSidebar,
//   } = useCalendarStore(
//     useShallow(
//       ({
//         setActiveSidebar,
//         updateEventOccurrences,
//         eventOccurrences,
//         clearEditingEventOccurrence,
//         clearDraftEventOccurrence,
//       }) => ({
//         setActiveSidebar,
//         updateEventOccurrences,
//         eventOccurrences,
//         clearEditingEventOccurrence,
//         clearDraftEventOccurrence,
//       }),
//     ),
//   );

//   const onSuccess = () => {
//     clearEditingEventOccurrence();
//     clearDraftEventOccurrence();
//     setActiveSidebar("main");
//   };

//   const { executeAsync: editNonRecurrentEventActionAsync } = useSafeAction(
//     editNonRecurrentEventAction,
//     {
//       onError: () => {
//         toast.error("Failed to edit event");
//       },
//       onSuccess: ({ input, data }) => {
//         console.log({ input, data });
//       },
//     },
//   );

//   const {
//     mutate: editNonRecurrentEvent,
//     isPending: isEditingNonRecurrentEvent,
//   } = useMutation({
//     mutationFn: async ({
//       values,
//       occurrenceId,
//     }: {
//       values: z.infer<typeof SessionOcurrenceFormSchema>;
//       occurrenceId: number;
//     }) => {
//       const { event } = buildEventOccurrencesData(values, true);
//       const eventOcurrence = eventOccurrences[occurrenceId];

//       if (!eventOcurrence) {
//         throw new PublicError(
//           "Event occurrence not found. It may have been deleted or moved.",
//         );
//       }

//       const result = await editNonRecurrentEventActionAsync({
//         eventId: eventOcurrence.eventId,
//         event,
//       });

//       if (!result?.data) {
//         return;
//       }

//       const calendarEventOccurrences = formatCalendarEventOcurrences({
//         event: result.data.editedEvent,
//         occurrences: [result.data.editedOcurrence],
//       });

//       updateEventOccurrences(calendarEventOccurrences);
//       onSuccess();

//       toast.success("Event updated successfully!");
//     },
//     onMutate: async (values) => {
//       console.log({ values });
//     },
//     onError: (error) => {
//       console.log("____________");
//       console.log({ error: error.message });
//       toast.error(error.message);
//     },
//   });

//   return { editNonRecurrentEvent, isEditingNonRecurrentEvent };
// };
