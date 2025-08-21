import { useShallow } from "zustand/react/shallow";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { AgendaViewDay } from "./agenda-view-day";

export const AgendaView = () => {
  const { visibleDates } = useCalendarStore(
    useShallow((store) => ({
      visibleDates: store.visibleDates,
    })),
  );

  return (
    <div className="h-full overflow-y-scroll pl-2 sm:pl-(--left-spacing) pb-(--left-spacing) space-y-6 sm:space-y-0 py-4 sm:py-2 pr-4 sm:pr-0">
      {visibleDates.map((date) => (
        <AgendaViewDay key={date.toString()} date={date} />
      ))}
    </div>
  );
};
