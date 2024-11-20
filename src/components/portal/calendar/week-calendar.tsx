"use client";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { useCalendarContext } from "./calendar-context";
import { useWeekCalendar } from "./hooks/use-week-calendar";

export const WeekCalendar = () => {
  const { weekDays } = useWeekCalendar();
  const { selectedDate } = useCalendarContext();

  return (
    <div className="flex flex-col h-full gap-2 relative overflow-hidden">
      <div className="w-full flex items-center pl-6 ">
        <div className="w-12 text-neutral-500 text-sm shrink-0 mr-2">
          GTM +1
        </div>
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <div
              key={format(day, "iiiiii")}
              className={cn(
                "flex-1 rounded-lg",
                isSelected && "bg-neutral-500/20 text-responsive-dark",
              )}
            >
              <div className="flex flex-col items-center justify-center p-1">
                <p className="text-sm text-neutral-500 lowercase">
                  {format(day, "iii")}
                </p>
                <p className="text-4xl font-medium text-responsive-dark ">
                  {day.getDate()}
                </p>
              </div>
            </div>
          );
        })}

        <div className="h-full px-2" />
      </div>
      <div className="pl-6 relative flex flex-col overflow-y-scroll">
        <div className="items-stretch flex flex-auto">
          <div className="mr-2 h-auto w-12">
            {Array.from({ length: 24 }).map((_, index) => {
              return (
                <div
                  key={`hour-${index}`}
                  className="h-16 flex items-center justify-center relative"
                >
                  <span className="text-sm text-neutral-500 absolute top-[-10px] right-0">
                    {index === 0 ? "" : `${String(index).padStart(2, "0")}:00`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-row w-full h-auto relative">
            <div className="absolute top-0 left-0 w-full h-full z-20">
              {Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={`day-${index}`}
                  className="flex-1 border-r last:border-none relative"
                >
                  <div className="flex flex-row">
                    {Array.from({ length: 7 }).map((_, hourIndex) => (
                      <div
                        key={`hour-grid-${index}-${hourIndex}`}
                        className="h-16 basis-full rounded-sm p-px"
                      >
                        <div className=" border-neutral-500/20 border w-full h-full">
                          <div className="p-0.5 rounded-[2px] h-1/2 w-full cursor-pointer">
                            <div className="hover:bg-neutral-500/20 h-full w-full transition-colors" />
                          </div>
                          <div className="p-0.5 rounded-[2px] h-1/2 w-full cursor-pointer">
                            <div className="hover:bg-neutral-500/20 h-full w-full transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {Array.from({ length: 7 }).map((_, index) => {
              return (
                <div
                  key={`day-${index}`}
                  className="flex-1 flex items-center justify-center px-4"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
