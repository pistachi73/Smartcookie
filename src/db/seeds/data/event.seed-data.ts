import type { InsertEvent } from "@/db/schema/event";
import type { InsertEventOccurrence } from "@/db/schema/event-occurrence";
import { CalendarDateTime, getLocalTimeZone } from "@internationalized/date";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const todayCalendarDateTime = new CalendarDateTime(year, month, day);

const timezone = getLocalTimeZone();

// Parse the date to UTC ISO string
const parseToUTCISOString = (date: CalendarDateTime) => {
  return date.toDate(timezone).toISOString();
};

const events: {
  event: Omit<InsertEvent, "userId">;
  eventOccurrences?: InsertEventOccurrence[];
}[] = [
  {
    event: {
      id: 1,
      title: "Algebra Basics - Level 1",
      description: "Algebra Basics",
      hubId: 1,
      startTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 10,
          minute: 0,
        }),
      ),
      endTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 11,
          minute: 30,
        }),
      ),
      timezone,
      price: 50,
      isRecurring: true,
      recurrenceRule: "Rule",
    },
    eventOccurrences: Array.from({ length: 1 }).map((_, index) => ({
      eventId: 1,
      startTime: todayCalendarDateTime
        .add({ days: index })
        .set({ hour: 10, minute: 0 })
        .toString(),
      endTime: todayCalendarDateTime
        .add({ days: index })
        .set({ hour: 11, minute: 30 })
        .toString(),
    })),
  },
  {
    event: {
      id: 2,
      title: "Spanish 101 - Introduction",
      description: "Spanish 101",
      hubId: 2,
      startTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 12,
          minute: 0,
        }),
      ),
      endTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 13,
          minute: 30,
        }),
      ),
      timezone,
      price: 40,
      isRecurring: false,
      recurrenceRule: null,
    },
    eventOccurrences: [
      {
        eventId: 2,
        startTime: parseToUTCISOString(
          todayCalendarDateTime.set({
            hour: 12,
            minute: 0,
          }),
        ),
        endTime: parseToUTCISOString(
          todayCalendarDateTime.set({
            hour: 13,
            minute: 30,
          }),
        ),
      },
    ],
  },
  {
    event: {
      id: 3,
      title: "Organic Chemistry Lab - Basics",
      description: "Organic Chemistry Lab",
      hubId: 3,
      startTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 14,
          minute: 0,
        }),
      ),
      endTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 15,
          minute: 30,
        }),
      ),
      timezone,
      price: 60,
      isRecurring: false,
      recurrenceRule: null,
    },
    eventOccurrences: [
      {
        eventId: 3,
        startTime: parseToUTCISOString(
          todayCalendarDateTime.set({
            hour: 14,
            minute: 0,
          }),
        ),
        endTime: parseToUTCISOString(
          todayCalendarDateTime.set({
            hour: 15,
            minute: 30,
          }),
        ),
      },
    ],
  },
  {
    event: {
      id: 4,
      title: "Biology II - Advanced Concepts",
      description: "Biology II",
      hubId: 3,
      startTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 9,
          minute: 0,
        }),
      ),
      endTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 10,
          minute: 30,
        }),
      ),
      timezone,
      price: 60,
      isRecurring: false,
      recurrenceRule: null,
    },
    eventOccurrences: [
      {
        eventId: 4,
        startTime: parseToUTCISOString(
          todayCalendarDateTime.set({
            hour: 9,
            minute: 0,
          }),
        ),
        endTime: parseToUTCISOString(
          todayCalendarDateTime.set({
            hour: 10,
            minute: 30,
          }),
        ),
      },
    ],
  },
  {
    event: {
      id: 5,
      title: "Advanced Calculus - Techniques",
      description: "Advanced Calculus",
      hubId: 1,
      startTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 11,
          minute: 0,
        }),
      ),
      endTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 12,
          minute: 30,
        }),
      ),
      timezone,
      price: 50,
      isRecurring: false,
      recurrenceRule: null,
    },
    eventOccurrences: [
      {
        eventId: 5,
        startTime: parseToUTCISOString(
          todayCalendarDateTime.set({
            hour: 11,
            minute: 0,
          }),
        ),
        endTime: parseToUTCISOString(
          todayCalendarDateTime.set({
            hour: 12,
            minute: 30,
          }),
        ),
      },
    ],
  },
  {
    event: {
      id: 6,
      title: "Advanced Calculus 2 - Techniques",
      description: "Advanced Calculus 2",
      hubId: 1,
      startTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 12,
          minute: 30,
        }),
      ),
      endTime: parseToUTCISOString(
        todayCalendarDateTime.set({
          hour: 14,
          minute: 30,
        }),
      ),
      timezone,
      price: 50,
      isRecurring: false,
      recurrenceRule: null,
    },
    eventOccurrences: [
      {
        eventId: 6,
        startTime: parseToUTCISOString(
          todayCalendarDateTime.set({
            hour: 12,
            minute: 30,
          }),
        ),
        endTime: parseToUTCISOString(
          todayCalendarDateTime.set({
            hour: 14,
            minute: 30,
          }),
        ),
      },
    ],
  },
];

export default events;
