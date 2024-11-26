import { getCalendarHubsByUserIdAction } from "./actions";
import { CalendarContent } from "./calendar-content";
import { CalendarContextProvider } from "./calendar-context";

export const Calendar = async () => {
  const res = await getCalendarHubsByUserIdAction();

  return (
    <CalendarContextProvider
      hubs={res?.data?.hubs}
      sessionOccurrences={res?.data?.sessionOccurrences}
    >
      <div className="w-full grow flex flex-col gap-12 pb-4">
        <CalendarContent />
      </div>
    </CalendarContextProvider>
  );
};
