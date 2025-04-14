import type {
  InsertAttendance,
  InsertSession,
  InsertSessionNote,
} from "@/db/schema";

const sessions: {
  session: Omit<InsertSession, "userId" | "hubId">;
  notes: Omit<InsertSessionNote, "userId" | "sessionId">[];
  attendance: Omit<InsertAttendance, "id" | "sessionId">[];
}[] = [
  {
    session: {
      startTime: new Date("2024-02-01T10:00:00").toISOString(),
      endTime: new Date("2024-02-01T11:00:00").toISOString(),
      status: "completed",
    },
    notes: [
      {
        position: "past",
        content: "Initial assessment of student's current language level",
      },
      {
        position: "past",
        content:
          "Identified key areas for improvement in grammar and vocabulary",
      },
      {
        position: "present",
        content: "Created personalied learning plan based on assessment",
      },
      {
        position: "future",
        content:
          "Prepare materials for next session focusing on basic conversation",
      },
    ],
    attendance: [
      { studentId: 1, status: "present" },
      { studentId: 2, status: "present" },
    ],
  },
  {
    session: {
      startTime: new Date("2024-02-15T10:00:00").toISOString(),
      endTime: new Date("2024-02-15T11:15:00").toISOString(),
      status: "completed",
    },
    notes: [
      {
        position: "past",
        content: "Reviewed basic conversation patterns from previous session",
      },
      {
        position: "past",
        content: "Student showed good progress with basic greetings",
      },
      {
        position: "present",
        content: "Introduced new vocabulary related to daily activities",
      },
      {
        position: "present",
        content: "Practiced forming simple sentences with new vocabulary",
      },
      {
        position: "future",
        content: "Create flashcards for new vocabulary words",
      },
    ],
    attendance: [
      { studentId: 1, status: "present" },
      { studentId: 2, status: "absent" },
    ],
  },
  {
    session: {
      startTime: new Date("2024-03-01T09:00:00").toISOString(),
      endTime: new Date("2024-03-01T11:00:00").toISOString(),
      status: "completed",
    },
    notes: [
      {
        position: "past",
        content: "Reviewed vocabulary flashcards from previous session",
      },
      {
        position: "past",
        content: "Student demonstrated strong retention of new words",
      },
      {
        position: "present",
        content: "Introduced basic grammar structures for present tense",
      },
      {
        position: "present",
        content: "Practiced conjugation of regular verbs",
      },
      {
        position: "future",
        content: "Prepare exercises for irregular verb conjugations",
      },
    ],
    attendance: [
      { studentId: 1, status: "present" },
      { studentId: 2, status: "absent" },
    ],
  },
  {
    session: {
      startTime: new Date("2024-03-15T10:00:00").toISOString(),
      endTime: new Date("2024-03-15T11:15:00").toISOString(),
    },
    notes: [
      {
        position: "past",
        content: "Reviewed regular verb conjugations from previous session",
      },
      {
        position: "past",
        content: "Student showed good understanding of present tense",
      },
      {
        position: "present",
        content: "Introduced irregular verb patterns",
      },
      {
        position: "present",
        content: "Practiced common irregular verbs in context",
      },
      {
        position: "future",
        content: "Create a list of most common irregular verbs for practice",
      },
    ],
    attendance: [
      { studentId: 1, status: "present" },
      { studentId: 2, status: "absent" },
    ],
  },
  {
    session: {
      startTime: new Date("2024-04-01T13:45:00").toISOString(),
      endTime: new Date("2024-04-01T15:00:00").toISOString(),
    },
    notes: [
      {
        position: "past",
        content: "Reviewed irregular verb list from previous session",
      },
      {
        position: "past",
        content:
          "Student demonstrated improved confidence with irregular verbs",
      },
      {
        position: "present",
        content: "Introduced past tense formation",
      },
      {
        position: "present",
        content: "Practiced simple past tense with regular verbs",
      },
      {
        position: "future",
        content: "Prepare materials for past tense with irregular verbs",
      },
    ],
    attendance: [
      { studentId: 1, status: "present" },
      { studentId: 2, status: "present" },
    ],
  },
  {
    session: {
      startTime: new Date("2024-04-15T13:45:00").toISOString(),
      endTime: new Date("2024-04-15T15:00:00").toISOString(),
    },
    notes: [
      {
        position: "past",
        content: "Reviewed past tense with regular verbs",
      },
      {
        position: "past",
        content: "Student showed good progress with past tense formation",
      },
      {
        position: "present",
        content: "Introduced past tense with irregular verbs",
      },
      {
        position: "present",
        content: "Practiced common irregular verbs in past tense",
      },
      {
        position: "future",
        content: "Create a comprehensive review of all tenses covered",
      },
    ],
    attendance: [
      { studentId: 1, status: "present" },
      { studentId: 2, status: "present" },
    ],
  },
];

export default sessions;
