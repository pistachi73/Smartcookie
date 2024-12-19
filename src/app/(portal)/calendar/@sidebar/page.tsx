import { CalendarSidebar } from "@/components/portal/calendar/calendar-sidebar";

const SideBarDefault = () => {
  return (
    <div className="h-full w-[280px] rounded-xl shrink-0 bg-background-base">
      <CalendarSidebar />
    </div>
  );
};

export default SideBarDefault;
