import type { InsertSession, InsertSessionNote } from "@/db/schema";
import { addDays, addHours, addMinutes } from "date-fns";

const today = new Date();
today.setHours(10, 0, 0, 0); // Set to 10:00 AM

const sessions: {
  hubName: string;
  session: Omit<InsertSession, "userId" | "hubId">;
  notes: Omit<InsertSessionNote, "userId" | "sessionId">[];
}[] = [
  {
    hubName: "Català A2 - Abat Oliba",
    session: {
      startTime: today.toISOString(),
      endTime: addHours(today, 1).toISOString(),
      status: "completed",
    },
    notes: [
      {
        position: "plans",
        content: "Initial assessment of student's current language level",
      },
      {
        position: "in-class",
        content:
          "Identified key areas for improvement in grammar and vocabulary",
      },
      {
        position: "in-class",
        content: "Created personalied learning plan based on assessment",
      },
      {
        position: "plans",
        content:
          "Prepare materials for next session focusing on basic conversation",
      },
    ],
  },
  {
    hubName: "Català A2 - Abat Oliba",
    session: {
      startTime: addDays(today, 1).toISOString(),
      endTime: addMinutes(addDays(today, 1), 75).toISOString(),
      status: "completed",
    },
    notes: [
      {
        position: "plans",
        content: "Reviewed basic conversation patterns from previous session",
      },
      {
        position: "in-class",
        content: "Student showed good progress with basic greetings",
      },
      {
        position: "in-class",
        content: "Introduced new vocabulary related to daily activities",
      },
      {
        position: "in-class",
        content: "Practiced forming simple sentences with new vocabulary",
      },
      {
        position: "plans",
        content: "Create flashcards for new vocabulary words",
      },
    ],
  },
  {
    hubName: "Español A1 - UAB",
    session: {
      startTime: addDays(today, 3).toISOString(),
      endTime: addHours(addDays(today, 3), 2).toISOString(),
      status: "completed",
    },
    notes: [
      {
        position: "plans",
        content: "Reviewed vocabulary flashcards from previous session",
      },
      {
        position: "in-class",
        content: "Student demonstrated strong retention of new words",
      },
      {
        position: "in-class",
        content: "Introduced basic grammar structures for present tense",
      },
      {
        position: "in-class",
        content: "Practiced conjugation of regular verbs",
      },
      {
        position: "plans",
        content: "Prepare exercises for irregular verb conjugations",
      },
    ],
  },
  {
    hubName: "Español A1 - UAB",
    session: {
      startTime: addDays(today, 4).toISOString(),
      endTime: addMinutes(addDays(today, 4), 75).toISOString(),
    },
    notes: [
      {
        position: "plans",
        content: "Reviewed regular verb conjugations from previous session",
      },
      {
        position: "in-class",
        content: "Student showed good understanding of present tense",
      },
      {
        position: "in-class",
        content: "Introduced irregular verb patterns",
      },
      {
        position: "in-class",
        content: "Practiced common irregular verbs in context",
      },
      {
        position: "plans",
        content: "Create a list of most common irregular verbs for practice",
      },
    ],
  },
  {
    hubName: "Español A2 - Bogi",
    session: {
      startTime: addDays(today, 6).toISOString(),
      endTime: addMinutes(addDays(today, 6), 75).toISOString(),
    },
    notes: [
      {
        position: "plans",
        content: "Reviewed irregular verb list from previous session",
      },
      {
        position: "in-class",
        content:
          "Student demonstrated improved confidence with irregular verbs",
      },
      {
        position: "in-class",
        content: "Introduced past tense formation",
      },
      {
        position: "in-class",
        content: "Practiced simple past tense with regular verbs",
      },
      {
        position: "plans",
        content: "Prepare materials for past tense with irregular verbs",
      },
    ],
  },
  {
    hubName: "Español A2 - Bogi",
    session: {
      startTime: addDays(today, 7).toISOString(),
      endTime: addMinutes(addDays(today, 7), 75).toISOString(),
    },
    notes: [
      {
        position: "plans",
        content: "Reviewed past tense with regular verbs",
      },
      {
        position: "in-class",
        content: "Student showed good progress with past tense formation",
      },
      {
        position: "in-class",
        content: "Introduced past tense with irregular verbs",
      },
      {
        position: "in-class",
        content: "Practiced common irregular verbs in past tense",
      },
      {
        position: "plans",
        content: "Create a comprehensive review of all tenses covered",
      },
    ],
  },
  {
    hubName: "Català A2 - Abat Oliba",
    session: {
      startTime: addDays(today, 8).toISOString(),
      endTime: addHours(addDays(today, 8), 1).toISOString(),
    },
    notes: [],
  },
  {
    hubName: "Español A1 - UAB",
    session: {
      startTime: addDays(today, 9).toISOString(),
      endTime: addMinutes(addDays(today, 9), 90).toISOString(),
    },
    notes: [],
  },
  {
    hubName: "Español A2 - Bogi",
    session: {
      startTime: addDays(today, 10).toISOString(),
      endTime: addHours(addDays(today, 10), 1).toISOString(),
    },
    notes: [],
  },
  {
    hubName: "Català A2 - Abat Oliba",
    session: {
      startTime: addDays(today, 11).toISOString(),
      endTime: addMinutes(addDays(today, 11), 75).toISOString(),
    },
    notes: [],
  },
  {
    hubName: "Español A1 - UAB",
    session: {
      startTime: addDays(today, 12).toISOString(),
      endTime: addHours(addDays(today, 12), 1).toISOString(),
    },
    notes: [],
  },
  {
    hubName: "Español A2 - Bogi",
    session: {
      startTime: addDays(today, 13).toISOString(),
      endTime: addMinutes(addDays(today, 13), 90).toISOString(),
    },
    notes: [],
  },
  {
    hubName: "Català A2 - Abat Oliba",
    session: {
      startTime: addDays(today, 14).toISOString(),
      endTime: addHours(addDays(today, 14), 1).toISOString(),
    },
    notes: [],
  },
];

export default sessions;
