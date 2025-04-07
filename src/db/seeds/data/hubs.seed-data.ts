import type { InsertHub } from "@/db/schema";

const hubs: Omit<InsertHub, "userId">[] = [
  {
    name: "Català A2 - Abat Oliba",
    description:
      "Everyday language, ERASMUS students living in BCN for 6 months.",
    schedule: "Tues/Thu from 13.45 to 15h",
    status: "active",
    color: "blueberry",
    level: "A2",
    startDate: new Date("2025-02-01").toISOString(),
    endDate: new Date("2025-06-20").toISOString(),
  },
  {
    name: "Español A1 - UAB",
    description: "AULA A1, 3 students from Japan and Corea",
    schedule: "Mon - Fri from 9 to 11h",
    status: "active",
    color: "graphite",
    level: "A1",
    startDate: new Date("2025-03-01").toISOString(),
    endDate: new Date("2025-05-01").toISOString(),
  },
  {
    name: "Español A2 - Bogi",
    description:
      "1to1, everyday language / 50min grammar class + 25min conversation class",
    schedule: "Tue/Thu",
    status: "active",
    color: "grape",
    level: "A2",
    startDate: new Date("2025-02-01").toISOString(),
    endDate: new Date("2025-06-20").toISOString(),
  },
  {
    name: "Español B1 - Rabia",
    description: "Conversation class, 1to1, economy/politics/antropology",
    schedule: "Mon - Wed, mornings",
    status: "active",
    color: "lavender",
    level: "B1",
    startDate: new Date("2024-02-01").toISOString(),
  },
  {
    name: "English B2 - Tech Team",
    description:
      "Business English for tech professionals, focus on presentations and meetings",
    schedule: "Wed/Fri from 16:00 to 17:30",
    status: "active",
    color: "flamingo",
    level: "B2",
    startDate: new Date("2024-03-01").toISOString(),
  },
  {
    name: "English C1 - Marketing",
    description:
      "Advanced English for marketing professionals, focus on copywriting and campaigns",
    schedule: "Mon/Wed from 10:00 to 11:30",
    status: "active",
    color: "tangerine",
    level: "C1",
    startDate: new Date("2024-04-01").toISOString(),
  },
  {
    name: "English A2 - Beginners",
    description: "Basic English for beginners, focus on everyday communication",
    schedule: "Tue/Thu from 18:00 to 19:30",
    status: "active",
    color: "banana",
    level: "A2",
    startDate: new Date("2024-05-01").toISOString(),
  },
  {
    name: "English B1 - Intermediate",
    description: "Intermediate English, focus on grammar and conversation",
    schedule: "Mon/Wed from 14:00 to 15:30",
    status: "active",
    color: "sage",
    level: "B1",
    startDate: new Date("2024-06-01").toISOString(),
  },
  {
    name: "English C2 - Advanced",
    description:
      "Advanced English for professionals, focus on business and academic writing",
    schedule: "Tue/Thu from 16:00 to 17:30",
    status: "active",
    color: "peacock",
    level: "C2",
    startDate: new Date("2024-07-01").toISOString(),
  },
  {
    name: "English A1 - Absolute Beginners",
    description:
      "English for absolute beginners, focus on basic vocabulary and pronunciation",
    schedule: "Mon/Wed from 9:00 to 10:30",
    status: "active",
    color: "neutral",
    level: "A1",
    startDate: new Date("2024-08-01").toISOString(),
  },
  {
    name: "English B2 - Conversation",
    description: "Conversation practice for intermediate students",
    schedule: "Fri from 15:00 to 17:00",
    status: "active",
    color: "sunshine",
    level: "B2",
    startDate: new Date("2024-09-01").toISOString(),
  },
  {
    name: "English C1 - Business",
    description:
      "Business English for executives, focus on negotiations and presentations",
    schedule: "Tue/Thu from 11:00 to 12:30",
    status: "active",
    color: "stone",
    level: "C1",
    startDate: new Date("2024-10-01").toISOString(),
  },
  {
    name: "English B1 - General",
    description: "General English course for intermediate students",
    schedule: "Mon/Wed from 16:00 to 17:30",
    status: "active",
    color: "slate",
    level: "B1",
    startDate: new Date("2024-11-01").toISOString(),
  },
];

export default hubs;
