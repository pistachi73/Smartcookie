import { getCalendarHubsByUserIdAction } from "./actions";
import { CalendarContent } from "./calendar-content";
import { CalendarContextProvider } from "./calendar-context";

export const Calendar = async () => {
  const res = await getCalendarHubsByUserIdAction();

  console.log({ res });

  return (
    <CalendarContextProvider
      hubs={res?.data?.hubs}
      sessionOccurrences={res?.data?.sessionOccurrences}
    >
      <div className="w-full h-full grow ">
        <CalendarContent />
      </div>
    </CalendarContextProvider>
  );
};
