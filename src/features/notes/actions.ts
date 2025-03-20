"use server";
import { db } from "@/db";
import { hub, quickNote } from "@/db/schema";
import type {
  HubSummary,
  HubWithNotes,
  NoteSummary,
} from "@/features/notes/types/quick-notes.types";
import { protectedAction } from "@/shared/lib/safe-action";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";

export const getHubsWithNotesAction = protectedAction.action(
  async ({ ctx }) => {
    const {
      user: { id },
    } = ctx;

    const res = await db
      .select({
        quickNote: {
          id: quickNote.id,
          hubId: quickNote.hubId,
          content: quickNote.content,
          updatedAt: quickNote.updatedAt,
        },
        hub: {
          id: hub.id,
          name: hub.name,
          color: hub.color,
        },
      })
      .from(quickNote)
      .leftJoin(hub, eq(quickNote.hubId, hub.id))
      .where(eq(quickNote.userId, id))
      .orderBy(desc(quickNote.updatedAt));

    const hubMap = new Map<number, HubSummary>();
    hubMap.set(0, { id: 0, name: "General Notes", color: "neutral" });
    res.forEach(({ hub }) => {
      if (hub && !hubMap.has(hub.id)) {
        hubMap.set(hub.id, hub);
      }
    });

    const hubs = Array.from(hubMap.values());

    const quickNotesByHubId = res.reduce((acc, { hub, quickNote }) => {
      const hubId = hub?.id || 0;
      if (!acc.has(hubId)) {
        acc.set(hubId, []);
      }
      acc.get(hubId)!.push(quickNote);
      return acc;
    }, new Map<number, NoteSummary[]>());

    return Array.from(hubs).map((hub) => ({
      hub,
      notes: quickNotesByHubId.get(hub.id || 0) || [],
    })) as HubWithNotes[];
  },
);

export const getHubsAction = protectedAction.action(async ({ ctx }) => {
  const {
    user: { id },
  } = ctx;

  const hubs = await db
    .select({
      id: hub.id,
      name: hub.name,
      color: hub.color,
    })
    .from(hub)
    .where(eq(hub.userId, id));

  return [
    { id: 0, name: "General Notes", color: "neutral" },
    ...hubs,
  ] as HubSummary[];
});

export const getHubNotesAction = protectedAction
  .schema(
    z.object({
      hubId: z.number(),
    }),
  )
  .action(async ({ ctx, parsedInput }) => {
    const {
      user: { id },
    } = ctx;

    const notes = await db
      .select({
        id: quickNote.id,
        content: quickNote.content,
        updatedAt: quickNote.updatedAt,
        hubId: quickNote.hubId,
      })
      .from(quickNote)
      .where(
        and(
          eq(quickNote.userId, id),
          parsedInput.hubId === 0
            ? isNull(quickNote.hubId)
            : eq(quickNote.hubId, parsedInput.hubId),
        ),
      )
      .orderBy(desc(quickNote.updatedAt));

    return notes as NoteSummary[];
  });

const AddQuickNoteSchema = z.object({
  hubId: z.number(),
  content: z.string(),
  updatedAt: z.string(),
});

export const addQuickNoteAction = protectedAction
  .schema(AddQuickNoteSchema)
  .action(async ({ ctx, parsedInput }) => {
    const {
      user: { id },
    } = ctx;

    const hubId = parsedInput.hubId === 0 ? null : parsedInput.hubId;

    try {
      const newNote = await db
        .insert(quickNote)
        .values({
          content: parsedInput.content,
          hubId: hubId,
          updatedAt: parsedInput.updatedAt,
          userId: id,
        })
        .returning();

      return newNote[0];
    } catch (error) {
      console.log(error);
      throw new Error("Failed to add note");
    }
  });

const UpdateQuickNoteSchema = z.object({
  id: z.number(),
  content: z.string(),
  updatedAt: z.string().optional(),
});

export const updateQuickNoteAction = protectedAction
  .schema(UpdateQuickNoteSchema)
  .action(async ({ ctx, parsedInput }) => {
    const {
      user: { id },
    } = ctx;

    const updateData: Record<string, unknown> = {
      content: parsedInput.content,
    };

    // Only set updatedAt if explicitly provided
    if (parsedInput.updatedAt) {
      updateData.updatedAt = parsedInput.updatedAt;
    }

    const updatedNote = await db
      .update(quickNote)
      .set(updateData)
      .where(and(eq(quickNote.id, parsedInput.id), eq(quickNote.userId, id)))
      .returning({
        id: quickNote.id,
        content: quickNote.content,
        updatedAt: quickNote.updatedAt,
        hubId: quickNote.hubId,
      });

    return updatedNote[0];
  });

const DeleteQuickNoteSchema = z.object({
  id: z.number(),
});

export const deleteQuickNoteAction = protectedAction
  .schema(DeleteQuickNoteSchema)
  .action(async ({ ctx, parsedInput }) => {
    const {
      user: { id },
    } = ctx;

    await db
      .delete(quickNote)
      .where(and(eq(quickNote.id, parsedInput.id), eq(quickNote.userId, id)));

    return { success: true };
  });
