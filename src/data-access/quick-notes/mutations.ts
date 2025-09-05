"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import type { InsertQuickNote } from "@/db/schema";
import { quickNote } from "@/db/schema";
import { withProtectedDataAccess } from "../with-protected-data-access";
import {
  CreateQuickNoteSchema,
  DeleteQuickNoteSchema,
  UpdateQuickNoteSchema,
} from "./schemas";

export const createQuickNote = withProtectedDataAccess({
  schema: CreateQuickNoteSchema,
  callback: async ({ hubId, content, updatedAt }, user) => {
    const actualHubId = hubId === 0 ? null : hubId;

    const newNote = await db
      .insert(quickNote)
      .values({
        content,
        hubId: actualHubId,
        updatedAt,
        userId: user.id,
      })
      .returning();

    return newNote[0];
  },
});

export const updateQuickNote = withProtectedDataAccess({
  schema: UpdateQuickNoteSchema,
  callback: async ({ id, content, updatedAt }, user) => {
    const updateData: Partial<InsertQuickNote> = {
      content,
    };

    // Only set updatedAt if explicitly provided
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
  },
});

export const deleteQuickNote = withProtectedDataAccess({
  schema: DeleteQuickNoteSchema,
  callback: async ({ id }, user) => {
    await db
      .delete(quickNote)
      .where(and(eq(quickNote.id, id), eq(quickNote.userId, user.id)));

    return { success: true };
  },
});
