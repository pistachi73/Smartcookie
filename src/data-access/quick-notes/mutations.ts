"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import type { InsertQuickNote } from "@/db/schema";
import { quickNote } from "@/db/schema";
import { authenticatedDataAccess } from "../data-access-chain";
import { createDataAccessError } from "../errors";
import {
  quickNoteContentLimitMiddleware,
  quickNoteLimitMiddleware,
} from "../limit-middleware";
import {
  CreateQuickNoteSchema,
  DeleteQuickNoteSchema,
  UpdateQuickNoteSchema,
} from "./schemas";

export const createQuickNote = authenticatedDataAccess()
  .input(CreateQuickNoteSchema)
  .use(quickNoteLimitMiddleware)
  .use(async ({ data, user }) =>
    quickNoteContentLimitMiddleware({ user, content: data.content }),
  )
  .execute(async ({ hubId, content, updatedAt }, user) => {
    const actualHubId = hubId === 0 ? null : hubId;
    const data = {
      content,
      hubId: actualHubId,
      updatedAt,
      userId: user.id,
    };
    const newNote = await db.insert(quickNote).values(data).returning();

    if (!newNote[0]) {
      return createDataAccessError({
        type: "UNEXPECTED_ERROR",
        message: "Failed to create note",
      });
    }

    return newNote[0];
  });

export const updateQuickNote = authenticatedDataAccess()
  .input(UpdateQuickNoteSchema({ maxLength: 1000 }))
  .use(async ({ data, user }) =>
    quickNoteContentLimitMiddleware({ user, content: data.content }),
  )
  .execute(async ({ id, content, updatedAt }, user) => {
    const updateData: Partial<InsertQuickNote> = {
      content,
    };

    if (updatedAt) {
      updateData.updatedAt = updatedAt;
    }

    const updatedNote = await db
      .update(quickNote)
      .set(updateData)
      .where(and(eq(quickNote.id, id), eq(quickNote.userId, user.id)))
      .returning({
        id: quickNote.id,
        content: quickNote.content,
        updatedAt: quickNote.updatedAt,
        hubId: quickNote.hubId,
      });

    return updatedNote[0];
  });

export const deleteQuickNote = authenticatedDataAccess()
  .input(DeleteQuickNoteSchema)
  .execute(async ({ id }, user) => {
    await db
      .delete(quickNote)
      .where(and(eq(quickNote.id, id), eq(quickNote.userId, user.id)));
  });
