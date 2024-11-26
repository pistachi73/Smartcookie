import { Calendar } from "@/components/portal/calendar";
import { DateTimePicker } from "@/components/ui/date-time-picker";

const CalendarPage = async () => {
  return (
    <>
      <div className="max-w-[300px]">
        <DateTimePicker />
      </div>
      {/* {sessionOccurrences.map((s) => (
        <p>{String(s.startTime)}</p>
      ))} */}
      <Calendar />
    </>
  );
};

export default CalendarPage;
