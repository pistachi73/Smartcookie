"use client";
import { differenceInMinutes, format, isSameDay } from "date-fns";
import { useCalendarContext } from "./calendar-context";

export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

export const DayCalendar = () => {
  const { selectedDate } = useCalendarContext();

  const mockEvents = [
    {
      id: 1,
      description: "Algebra Basics",
      hubId: 1,
      startTime: new Date("2024-11-21T09:00:00.000Z"),
      endTime: new Date("2024-11-21T10:30:00.000Z"),
      price: 50,
      isRecurring: true,
      recurrenceRule: [Object],
      exceptions: [Array],
    },
    {
      id: 1,
      description: "Algebra Basics",
      hubId: 1,
      startTime: new Date("2024-12-12T09:00:00.000Z"),
      endTime: new Date("2024-12-12T10:30:00.000Z"),
      price: 50,
      isRecurring: true,
      recurrenceRule: [Object],
      exceptions: [Array],
    },
    {
      id: 1,
      description: "Algebra Basics",
      hubId: 1,
      startTime: new Date("2024-12-19T09:00:00.000Z"),
      endTime: new Date("2024-12-19T10:30:00.000Z"),
      price: 50,
      isRecurring: true,
      recurrenceRule: [Object],
      exceptions: [Array],
    },
    {
      id: 1,
      description: "Algebra Basics",
      hubId: 1,
      startTime: new Date("2024-12-26T09:00:00.000Z"),
      endTime: new Date("2024-12-26T10:30:00.000Z"),
      price: 50,
      isRecurring: true,
      recurrenceRule: [Object],
      exceptions: [Array],
    },
  ];

  const dayEvents = mockEvents.filter(
    (event) =>
      isSameDay(event.startTime, selectedDate) ||
      isSameDay(event.endTime, selectedDate),
  );

  return (
    <div className="flex flex-col h-full gap-2 relative overflow-hidden">
      <div className="w-full flex items-center pl-6 ">
        <div className="w-12 text-neutral-500 text-sm shrink-0 mr-3">
          GTM +1
        </div>
        <div className="flex flex-col w-16 items-center justify-center p-1">
          <p className="text-sm text-neutral-500 lowercase">
            {format(selectedDate, "iii")}
          </p>
          <p className="text-4xl font-medium text-responsive-dark ">
            {selectedDate.getDate()}
          </p>
        </div>

        <div className="h-full px-2" />
      </div>
      <div className="pl-6 relative flex flex-col overflow-y-scroll">
        <div className="items-stretch flex flex-auto">
          <div className="mr-3 h-auto w-12">
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
                    <div className="h-16 basis-full rounded-sm p-px">
                      <div className=" border-neutral-500/20 border w-full h-full">
                        <div className="p-0.5 rounded-[2px] h-1/2 w-full cursor-pointer">
                          <div className="hover:bg-neutral-500/20 h-full w-full transition-colors" />
                        </div>
                        <div className="p-0.5 rounded-[2px] h-1/2 w-full cursor-pointer">
                          <div className="hover:bg-neutral-500/20 h-full w-full transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 flex items-center justify-center z-20 relative">
              {dayEvents.map((event) => {
                const top =
                  (event.startTime.getHours() +
                    event.startTime.getMinutes() / 60) *
                  4;
                const height =
                  (differenceInMinutes(event.endTime, event.startTime) / 60) *
                  4;
                return (
                  <div
                    key={event.id}
                    className="bg-primary/10 rounded-sm w-full absolute left-0 p-2"
                    style={{
                      top: `${top}rem`,
                      height: `${height}rem`,
                    }}
                  >
                    <p>{event.description}</p>
                    <p>
                      From {format(event.startTime, "HH:mm")}
                      {" to "}
                      {format(event.endTime, "HH:mm")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
