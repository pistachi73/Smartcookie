import type { InsertSession } from "@/db/schema/session";
import type { InsertSessionException } from "@/db/schema/session-exception";
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

const sessions: {
  session: InsertSession;
  exceptions?: InsertSessionException[];
}[] = [
  {
    session: {
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
      recurrenceRule: {
        frequency: "weekly",
        interval: 1,
        daysOfWeek: ["1", "3"],
        endDate: todayCalendarDateTime.add({ months: 4 }).toString(),
      },
    },
    exceptions: [
      {
        sessionId: 1,
        exceptionDate: parseToUTCISOString(
          todayCalendarDateTime.add({ weeks: 4 }),
        ),
        reason: "cancelled",
        newStartTime: null,
        newEndTime: null,
        comments: "Session cancelled due to holiday",
      },
      {
        sessionId: 1,
        exceptionDate: parseToUTCISOString(
          todayCalendarDateTime.add({ days: 14 }),
        ),
        reason: "reschedule",
        newStartTime: parseToUTCISOString(
          todayCalendarDateTime.add({ days: 14 }).set({ hour: 11, minute: 0 }),
        ),
        newEndTime: parseToUTCISOString(
          todayCalendarDateTime.add({ days: 14 }).set({ hour: 12, minute: 30 }),
        ),
        comments: "Session rescheduled for later time",
      },
    ],
  },
  {
    session: {
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
  },
  {
    session: {
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
  },
  {
    session: {
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
  },
  {
    session: {
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
  },
];

export default sessions;
