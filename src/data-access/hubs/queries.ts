"use server";

import { asc, desc, eq } from "drizzle-orm";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { hub } from "@/db/schema";
import {
  parseOptionalDateWithTimezone,
  parseRequiredDateWithTimezone,
} from "../utils";
import { getUserHubCountInternal } from "./internal";
import { GetHubByIdSchema } from "./schemas";

export const getHubsByUserIdForQuickNotes = withProtectedDataAccess({
  callback: async (user) => {
    return await db
      .select({
        id: hub.id,
        name: hub.name,
        color: hub.color,
        status: hub.status,
      })
      .from(hub)
      .where(eq(hub.userId, user.id));
  },
});

export const getHubsByUserId = withProtectedDataAccess({
  callback: async (user) => {
    const hubs = await db.query.hub.findMany({
      columns: {
        id: true,
        name: true,
        description: true,
        status: true,
        level: true,
        color: true,
        schedule: true,
        lastActivityAt: true,
      },
      extras: {
        startDate: parseRequiredDateWithTimezone(hub.startDate, "startDate"),
        endDate: parseOptionalDateWithTimezone(hub.endDate, "endDate"),
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
      where: eq(hub.userId, user.id),
      orderBy: [desc(hub.lastActivityAt)],
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

export const getHubById = withProtectedDataAccess({
  schema: GetHubByIdSchema,
  callback: async ({ hubId }) => {
    const res = await db
      .select({
        id: hub.id,
        name: hub.name,
        description: hub.description,
        status: hub.status,
        startDate: parseRequiredDateWithTimezone(hub.startDate, "startDate"),
        endDate: parseOptionalDateWithTimezone(hub.endDate, "endDate"),
        color: hub.color,
      })
      .from(hub)
      .where(eq(hub.id, hubId))
      .limit(1);

    return res[0] ?? null;
  },
});

export const getUserHubCount = withProtectedDataAccess({
  callback: async (user) => {
    return getUserHubCountInternal(user.id);
  },
});
