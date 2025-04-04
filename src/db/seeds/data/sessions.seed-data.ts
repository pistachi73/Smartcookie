import type { InsertSession, InsertSessionNote } from "@/db/schema";

const sessions: {
  session: Omit<InsertSession, "userId" | "hubId">;
  notes: Omit<InsertSessionNote, "userId" | "sessionId">[];
}[] = [
  {
    session: {
      startTime: new Date("2024-02-01T10:00:00Z").toISOString(),
      endTime: new Date("2024-02-01T11:00:00Z").toISOString(),
      status: "completed",
    },
    notes: [
      {
        position: "past",
        content: "Initial assessment of student's current language level",
        order: 0,
      },
      {
        position: "past",
        content:
          "Identified key areas for improvement in grammar and vocabulary",
        order: 1,
      },
      {
        position: "present",
        content: "Created personalized learning plan based on assessment",
        order: 0,
      },
      {
        position: "future",
        content:
          "Prepare materials for next session focusing on basic conversation",
        order: 0,
      },
    ],
  },
  {
    session: {
      startTime: new Date("2024-02-15T10:00:00Z").toISOString(),
      endTime: new Date("2024-02-15T11:15:00Z").toISOString(),
      status: "completed",
    },
    notes: [
      {
        position: "past",
        content: "Reviewed basic conversation patterns from previous session",
        order: 0,
      },
      {
        position: "past",
        content: "Student showed good progress with basic greetings",
        order: 1,
      },
      {
        position: "present",
        content: "Introduced new vocabulary related to daily activities",
        order: 0,
      },
      {
        position: "present",
        content: "Practiced forming simple sentences with new vocabulary",
        order: 1,
      },
      {
        position: "future",
        content: "Create flashcards for new vocabulary words",
        order: 0,
      },
    ],
  },
  {
    session: {
      startTime: new Date("2024-03-01T09:00:00Z").toISOString(),
      endTime: new Date("2024-03-01T11:00:00Z").toISOString(),
      status: "completed",
    },
    notes: [
      {
        position: "past",
        content: "Reviewed vocabulary flashcards from previous session",
        order: 0,
      },
      {
        position: "past",
        content: "Student demonstrated strong retention of new words",
        order: 1,
      },
      {
        position: "present",
        content: "Introduced basic grammar structures for present tense",
        order: 0,
      },
      {
        position: "present",
        content: "Practiced conjugation of regular verbs",
        order: 1,
      },
      {
        position: "future",
        content: "Prepare exercises for irregular verb conjugations",
        order: 0,
      },
    ],
  },
  {
    session: {
      startTime: new Date("2024-03-15T10:00:00Z").toISOString(),
      endTime: new Date("2024-03-15T11:15:00Z").toISOString(),
    },
    notes: [
      {
        position: "past",
        content: "Reviewed regular verb conjugations from previous session",
        order: 0,
      },
      {
        position: "past",
        content: "Student showed good understanding of present tense",
        order: 1,
      },
      {
        position: "present",
        content: "Introduced irregular verb patterns",
        order: 0,
      },
      {
        position: "present",
        content: "Practiced common irregular verbs in context",
        order: 1,
      },
      {
        position: "future",
        content: "Create a list of most common irregular verbs for practice",
        order: 0,
      },
    ],
  },
  {
    session: {
      startTime: new Date("2024-04-01T13:45:00Z").toISOString(),
      endTime: new Date("2024-04-01T15:00:00Z").toISOString(),
    },
    notes: [
      {
        position: "past",
        content: "Reviewed irregular verb list from previous session",
        order: 0,
      },
      {
        position: "past",
        content:
          "Student demonstrated improved confidence with irregular verbs",
        order: 1,
      },
      {
        position: "present",
        content: "Introduced past tense formation",
        order: 0,
      },
      {
        position: "present",
        content: "Practiced simple past tense with regular verbs",
        order: 1,
      },
      {
        position: "future",
        content: "Prepare materials for past tense with irregular verbs",
        order: 0,
      },
    ],
  },
  {
    session: {
      startTime: new Date("2024-04-15T13:45:00Z").toISOString(),
      endTime: new Date("2024-04-15T15:00:00Z").toISOString(),
    },
    notes: [
      {
        position: "past",
        content: "Reviewed past tense with regular verbs",
        order: 0,
      },
      {
        position: "past",
        content: "Student showed good progress with past tense formation",
        order: 1,
      },
      {
        position: "present",
        content: "Introduced past tense with irregular verbs",
        order: 0,
      },
      {
        position: "present",
        content: "Practiced common irregular verbs in past tense",
        order: 1,
      },
      {
        position: "future",
        content: "Create a comprehensive review of all tenses covered",
        order: 0,
      },
    ],
  },
];

export default sessions;
