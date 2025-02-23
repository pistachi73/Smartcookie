import { useCalendarStore } from "@/providers/calendar-store-provider";
import { useShallow } from "zustand/react/shallow";
import { AgendaViewDay } from "./agenda-view-day";

export const AgendaView = () => {
  const selectedDate = useCalendarStore(
    useShallow((store) => store.selectedDate),
  );

  return (
    <div className="h-full overflow-y-scroll pl-[var(--left-spacing)] p-4 pb-[var(--left-spacing)]">
      <div className="space-y-2 ">
        {Array.from({ length: 14 }).map((_, dayIndex) => {
          const date = selectedDate.add({ days: dayIndex });
          return <AgendaViewDay key={date.toString()} date={date} />;
        })}
      </div>
    </div>
  );
};
