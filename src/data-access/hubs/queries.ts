"use server";

import { db } from "@/db";
import { hub } from "@/db/schema";
import { asc, eq, sql } from "drizzle-orm";
import {
  withAuthenticationNoInput,
  withValidationAndAuth,
} from "../protected-data-access";
import { parseDateWithTimezone } from "../utils";
import { GetHubByIdSchema } from "./schema";

export const getHubsByUserIdForQuickNotes = withAuthenticationNoInput({
  callback: async (userId) => {
    return await db
      .select({
        id: hub.id,
        name: hub.name,
        color: hub.color,
      })
      .from(hub)
      .where(eq(hub.userId, userId));
  },
});

export const getHubsByUserId = withAuthenticationNoInput({
  callback: async (userId) => {
    const hubs = await db.query.hub.findMany({
      columns: {
        id: true,
        name: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
        level: true,
        color: true,
        schedule: true,
      },
      with: {
        studentHubs: {
          columns: {},
          with: {
            student: {
              columns: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      where: eq(hub.userId, userId),
      orderBy: [asc(sql`LOWER(${hub.name})`)],
    });

    const formattedHubs = hubs.map((hub) => {
      return {
        ...hub,
        studentsCount: hub.studentHubs.length,
        students: hub.studentHubs.map((sh) => sh.student),
      };
    });

    return formattedHubs;
  },
});

export const getHubById = withValidationAndAuth({
  schema: GetHubByIdSchema,
  callback: async ({ hubId }) => {
    const res = await db
      .select({
        id: hub.id,
        name: hub.name,
        description: hub.description,
        status: hub.status,
        startDate: parseDateWithTimezone(hub.startDate, "startDate"),
        endDate: parseDateWithTimezone(hub.endDate, "endDate"),
        color: hub.color,
      })
      .from(hub)
      .where(eq(hub.id, hubId))
      .limit(1);

    return res[0];
  },
});
