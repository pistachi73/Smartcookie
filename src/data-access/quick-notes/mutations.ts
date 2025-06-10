"use server";

import { db } from "@/db";
import type { InsertQuickNote } from "@/db/schema";
import { quickNote } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { withValidationAndAuth } from "../protected-data-access";
import {
  CreateQuickNoteSchema,
  DeleteQuickNoteSchema,
  UpdateQuickNoteSchema,
} from "./schemas";

export const createQuickNote = withValidationAndAuth({
  schema: CreateQuickNoteSchema,
  callback: async ({ hubId, content, updatedAt }, userId) => {
    const actualHubId = hubId === 0 ? null : hubId;

    const newNote = await db
      .insert(quickNote)
      .values({
        content,
        hubId: actualHubId,
        updatedAt,
        userId,
      })
      .returning();

    return newNote[0];
  },
});

export const updateQuickNote = withValidationAndAuth({
  schema: UpdateQuickNoteSchema,
  callback: async ({ id, content, updatedAt }, userId) => {
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
      .where(and(eq(quickNote.id, id), eq(quickNote.userId, userId)))
      .returning({
        id: quickNote.id,
        content: quickNote.content,
        updatedAt: quickNote.updatedAt,
        hubId: quickNote.hubId,
      });

    return updatedNote[0];
  },
});

export const deleteQuickNote = withValidationAndAuth({
  schema: DeleteQuickNoteSchema,
  callback: async ({ id }, userId) => {
    await db
      .delete(quickNote)
      .where(and(eq(quickNote.id, id), eq(quickNote.userId, userId)));

    return { success: true };
  },
});
