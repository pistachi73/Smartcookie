"use server";

import { db } from "@/db";
import { hub, quickNote, student, studentHub } from "@/db/schema";
import type { GetHubByIdUseCaseSchema } from "@/features/hub/lib/schemas";
import { currentUser } from "@/shared/lib/auth";
import { jsonAggregateObjects } from "@/shared/lib/query/json-aggregate-objects";
import { and, eq } from "drizzle-orm";
import type { z } from "zod";

export const getHubByIdUseCase = async ({
  hubId,
}: z.infer<typeof GetHubByIdUseCaseSchema>) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const res = await db
    .select({
      id: hub.id,
      name: hub.name,
      description: hub.description,
      schedule: hub.schedule,
      level: hub.level,
      status: hub.status,
      startDate: hub.startDate,
      endDate: hub.endDate,
      color: hub.color,
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
        email: student.email,
        image: student.image,
      }).as("students"),
      notes: jsonAggregateObjects<
        {
          id: number | string;
          title: string;
          content: string;
        }[]
      >({
        id: quickNote.id,
        content: quickNote.content,
      }).as("notes"),
    })
    .from(hub)
    .leftJoin(studentHub, eq(hub.id, studentHub.hubId))
    .leftJoin(student, eq(studentHub.studentId, student.id))
    .leftJoin(quickNote, eq(hub.id, quickNote.hubId))
    .where(and(eq(hub.id, hubId), eq(hub.userId, user.id)))
    .groupBy(hub.id);

  return res[0];
};
