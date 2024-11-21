import type { InsertSession } from "@/db/schema/session";
import type { InsertSessionException } from "@/db/schema/session-exception";
import { addWeeks } from "date-fns";

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDate = today.getDate();

const sessions: {
  session: InsertSession;
  exceptions?: InsertSessionException[];
}[] = [
  {
    session: {
      id: 1, // Unique identifier for the session
      description: "Algebra Basics",
      hubId: 1, // Math Tutoring Hub
      startTime: new Date(currentYear, currentMonth, currentDate, 10, 0, 0),
      endTime: new Date(currentYear, currentMonth, currentDate, 11, 30, 0),
      price: 50,
      isRecurring: true,
      recurrenceRule: {
        frequency: "weekly",
        interval: 1,
        daysOfWeek: ["Mo", "We"],
      },
    },
    exceptions: [
      {
        sessionId: 1,
        exceptionDate: addWeeks(today, 1),
        reason: "cancelled",
        newStartTime: null,
        newEndTime: null,
        comments: "Session cancelled due to holiday",
      },
      {
        sessionId: 1,
        exceptionDate: new Date(currentYear, currentMonth, currentDate + 14),
        reason: "reschedule",
        newStartTime: new Date(
          currentYear,
          currentMonth,
          currentDate + 14,
          11,
          0,
          0,
        ),
        newEndTime: new Date(
          currentYear,
          currentMonth,
          currentDate + 14,
          12,
          30,
          0,
        ),
        comments: "Session rescheduled for later time",
      },
    ],
  },
  {
    session: {
      id: 2,
      description: "Spanish 101",
      hubId: 2, // Language Learning Hub
      startTime: new Date(currentYear, currentMonth, currentDate, 12, 0, 0),
      endTime: new Date(currentYear, currentMonth, currentDate, 13, 30, 0),
      price: 40,
      isRecurring: false,
      recurrenceRule: null,
    },
  },
  {
    session: {
      id: 3,
      description: "Organic Chemistry Lab",
      hubId: 3, // Science Exploration Hub
      startTime: new Date(currentYear, currentMonth, currentDate, 14, 0, 0),
      endTime: new Date(currentYear, currentMonth, currentDate, 15, 30, 0),
      price: 60,
      isRecurring: false,
      recurrenceRule: null,
    },
  },
  {
    session: {
      id: 4,
      description: "Biology II",
      hubId: 3, // Science Exploration Hub
      startTime: new Date(currentYear, currentMonth, currentDate, 9, 0, 0),
      endTime: new Date(currentYear, currentMonth, currentDate, 10, 30, 0),
      price: 60,
      isRecurring: false,
      recurrenceRule: null,
    },
  },
  {
    session: {
      id: 5,
      description: "Advanced Calculus",
      hubId: 1, // Math Tutoring Hub
      startTime: new Date(currentYear, currentMonth, currentDate, 11, 0, 0),
      endTime: new Date(currentYear, currentMonth, currentDate, 12, 30, 0),
      price: 50,
      isRecurring: false,
      recurrenceRule: null,
    },
  },
];

export default sessions;
