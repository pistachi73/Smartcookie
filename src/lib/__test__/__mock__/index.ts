import type { Session, SessionException } from "@/db/schema";
import type { SessionOccurrence } from "@/lib/generate-session-ocurrences";
import { addMinutes, addMonths, addWeeks } from "date-fns";

export const mockDate = new Date("2024-11-03T21:00:00.000Z");

export const mockRecurrentSession: Session = {
  id: 1,
  description: "Recurrent session",
  hubId: 1,
  startTime: mockDate,
  endTime: addMinutes(mockDate, 60),
  price: 100,
  isRecurring: true,
  recurrenceRule: {
    frequency: "weekly",
    interval: 1,
    daysOfWeek: ["Mo"],
    endDate: addMonths(mockDate, 1),
  },
};

export const mockException: SessionException = {
  id: 1,
  sessionId: 1,
  exceptionDate: addWeeks(mockDate, 1),
  reason: "skip",
  comments: null,
  newEndTime: null,
  newStartTime: null,
};

export const mockSessionOccurrences: SessionOccurrence[] = [
  {
    sessionId: 1,
    hubId: 1,
    description: "Recurrent session",
    startTime: mockDate,
    endTime: addMinutes(mockDate, 60),
    exceptionReason: undefined,
  },
  {
    sessionId: 1,
    hubId: 1,
    description: "Recurrent session",
    startTime: addWeeks(mockDate, 1),
    endTime: addMinutes(addWeeks(mockDate, 1), 60),
    exceptionReason: "skip",
  },
  // Overlapping session with the first one
  {
    sessionId: 2,
    hubId: 1,
    description: "Overlapping session",
    startTime: addMinutes(mockDate, 30), // Starts 30 mins into the first session
    endTime: addMinutes(mockDate, 90), // Ends 30 mins after the first session
    exceptionReason: undefined,
  },
  // Another overlapping session on a different date
  {
    sessionId: 1,
    hubId: 1,
    description: "Recurrent session",
    startTime: addWeeks(mockDate, 2),
    endTime: addMinutes(addWeeks(mockDate, 2), 60),
    exceptionReason: undefined,
  },
  {
    sessionId: 3,
    hubId: 1,
    description: "Overlapping session 2",
    startTime: addMinutes(addWeeks(mockDate, 2), 30), // Starts 30 mins into the third session
    endTime: addMinutes(addWeeks(mockDate, 2), 90), // Ends 30 mins after the third session
    exceptionReason: undefined,
  },
] as const;

export const groupedSessionOccurrences = [
  [mockSessionOccurrences[0], mockSessionOccurrences[2]],
  [mockSessionOccurrences[1]],
  [mockSessionOccurrences[3], mockSessionOccurrences[4]],
];
