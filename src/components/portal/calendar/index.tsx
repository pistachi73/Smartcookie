import { getCalendarHubsByUserIdAction } from "./actions";
import { CalendarContextProvider } from "./calendar-context";
import { SessionUpdateForm } from "./components/session-update-form";

export const Calendar = async () => {
  const res = await getCalendarHubsByUserIdAction();

  return (
    <CalendarContextProvider
      hubs={res?.data?.hubs}
      sessionOccurrences={res?.data?.sessionOccurrences}
    >
      <SessionUpdateForm />
      {/* <div className="w-full h-full grow ">
        <CalendarContent />
      </div> */}
    </CalendarContextProvider>
  );
};
