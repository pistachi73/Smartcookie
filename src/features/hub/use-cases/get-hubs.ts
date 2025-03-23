import { db } from "@/db";
import { hub, student, studentHub } from "@/db/schema";
import { jsonAggregateObjects } from "@/shared/lib/query/json-aggregate-objects";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const GetHubsSchema = z.object({
  userId: z.string(),
});

export const getHubsUseCase = async ({
  userId,
}: z.infer<typeof GetHubsSchema>) => {
  const hubs = await db
    .select({
      id: hub.id,
      name: hub.name,
      description: hub.description,
      status: hub.status,
      startDate: hub.startDate,
      endDate: hub.endDate,
      level: hub.level,
      color: hub.color,
      schedule: hub.schedule,
      studentsCount: sql<number>`COUNT(${studentHub.studentId})`.as(
        "studentsCount",
      ),
      students: jsonAggregateObjects<
        {
          id: number | string;
          name: string;
          email: string;
          image: string | null;
        }[]
      >({
        id: student.id,
        name: student.name,
        image: student.image,
        email: student.email,
      }).as("students"),
    })
    .from(hub)
    .leftJoin(studentHub, eq(hub.id, studentHub.hubId))
    .leftJoin(student, eq(studentHub.studentId, student.id))
    .where(eq(hub.userId, userId))
    .groupBy(hub.id);

  console.log(hubs[0]?.students);

  return hubs;
};
