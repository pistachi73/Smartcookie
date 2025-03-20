import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import { useShallow } from "zustand/react/shallow";
import { AgendaViewDay } from "./agenda-view-day";

export const AgendaView = () => {
  const { visibleDates } = useCalendarStore(
    useShallow((store) => ({
      visibleDates: store.visibleDates,
    })),
  );

  return (
    <div className="h-full overflow-y-scroll pl-[var(--left-spacing)] p-4 pb-[var(--left-spacing)]">
      <div className="space-y-2 ">
        {visibleDates.map((date) => (
          <AgendaViewDay key={date.toString()} date={date} />
        ))}
      </div>
    </div>
  );
};
