"use server";

import { and, eq } from "drizzle-orm";

import { sideEffects } from "@/core/side-effects";
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

    if (actualHubId) {
      sideEffects.enqueue("updateHubLastActivity", {
        hubId: actualHubId,
        userid: user.id,
      });
    }

    return newNote[0];
  });

export const updateQuickNote = authenticatedDataAccess()
  .input(UpdateQuickNoteSchema({ maxLength: 1000 }))
  .use(async ({ data, user }) =>
    quickNoteContentLimitMiddleware({ user, content: data.content }),
  )
  .execute(async ({ id, content }, user) => {
    const updateData: Partial<InsertQuickNote> = {
      content,
    };

    const [updatedNote] = await db
      .update(quickNote)
      .set(updateData)
      .where(and(eq(quickNote.id, id), eq(quickNote.userId, user.id)))
      .returning({
        id: quickNote.id,
        content: quickNote.content,
        hubId: quickNote.hubId,
      });
    if (!updatedNote) {
      return createDataAccessError({
        type: "UNEXPECTED_ERROR",
        message: "Failed to update note",
      });
    }

    if (updatedNote.hubId) {
      sideEffects.enqueue("updateHubLastActivity", {
        hubId: updatedNote.hubId,
        userid: user.id,
      });
    }
    return updatedNote;
  });

export const deleteQuickNote = authenticatedDataAccess()
  .input(DeleteQuickNoteSchema)
  .execute(async ({ id }, user) => {
    const [deletedNote] = await db
      .delete(quickNote)
      .where(and(eq(quickNote.id, id), eq(quickNote.userId, user.id)))
      .returning();

    if (deletedNote?.hubId) {
      console.log("Updating lastActivity for hub", deletedNote.hubId);
      sideEffects.enqueue("updateHubLastActivity", {
        hubId: deletedNote.hubId,
        userid: user.id,
      });
    }
  });
