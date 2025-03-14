import type { InsertQuickNote } from "@/db/schema";

const quickNotes: Omit<
  InsertQuickNote,
  "userId" | "createdAt" | "updatedAt"
>[] = [
  {
    hubId: 1,
    content:
      "Need to prepare additional practice problems for next week's algebra session",
  },
  {
    hubId: 1,
    content: "Student showing great progress in quadratic equations",
  },
  {
    hubId: 2,
    content: "Remember to bring Spanish conversation cards for next class",
  },
  {
    hubId: 2,
    content: "Need to focus more on pronunciation exercises",
  },
  {
    hubId: 3,
    content: "Prepare lab safety guidelines for next chemistry experiment",
  },
  {
    hubId: 3,
    content: "Students requested more hands-on biology activities",
  },
];

export default quickNotes;
