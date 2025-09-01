import type { getPaginatedUserStudents } from "@/data-access/students/queries";

export type Student = NonNullable<
  Awaited<ReturnType<typeof getPaginatedUserStudents>>
>["students"][number];
