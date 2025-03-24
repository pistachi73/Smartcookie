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
];

export default hubs;
