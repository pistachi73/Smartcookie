import { Calendar } from "@/components/portal/calendar";

const CalendarPage = async () => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-background-base max-h-[calc(100dvh-88px)]">
      <Calendar />
    </div>
  );
};

export default CalendarPage;
