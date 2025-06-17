import type { InsertQuickNote } from "@/db/schema";

const quickNotes: (Omit<
  InsertQuickNote,
  "userId" | "hubId" | "createdAt" | "updatedAt"
> & { hubName: string })[] = [
  {
    hubName: "Català A2 - Abat Oliba",
    content:
      "Need to prepare additional practice problems for next week's algebra session",
  },
  {
    hubName: "Català A2 - Abat Oliba",
    content: "Student showing great progress in quadratic equations",
  },
  {
    hubName: "Español A1 - UAB",
    content: "Remember to bring Spanish conversation cards for next class",
  },
  {
    hubName: "Español A1 - UAB",
    content: "Need to focus more on pronunciation exercises",
  },
  {
    hubName: "Español A2 - Bogi",
    content: "Prepare lab safety guidelines for next chemistry experiment",
  },
  {
    hubName: "Español A2 - Bogi",
    content: "Students requested more hands-on biology activities",
  },
];

export default quickNotes;
