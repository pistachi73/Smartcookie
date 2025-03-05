"use server";
import { db } from "@/db";
import { hub, quickNote } from "@/db/schema";
import { protectedAction } from "@/lib/safe-action";
import { desc, eq, max, sql } from "drizzle-orm";
import { z } from "zod";
import type { NoteSummary } from "./types";

export const getQuickNotesDataAction = protectedAction.action(
  async ({ ctx }) => {
    const {
      user: { id },
    } = ctx;

    // Get hubs with their most recent quick note's updatedAt timestamp
    const hubsWithLatestNotes = await db
      .select({
        id: hub.id,
        name: hub.name,
        latestNoteDate: max(quickNote.updatedAt),
      })
      .from(hub)
      .where(eq(hub.userId, id))
      .leftJoin(quickNote, eq(quickNote.hubId, hub.id))
      .groupBy(hub.id, hub.name)
      .orderBy(
        // Order by the latest note date (descending), with nulls last
        sql`CASE WHEN ${max(quickNote.updatedAt)} IS NULL THEN 1 ELSE 0 END, ${max(quickNote.updatedAt)} DESC`,
      );

    console.log(hubsWithLatestNotes);

    return hubsWithLatestNotes;
  },
);

export const getQuickNotesPageDataAction = protectedAction.action(
  async ({ ctx }) => {
    const {
      user: { id },
    } = ctx;

    console.log("user id", id);

    const hubsWithNotes = await db
      .select({
        hub: {
          id: hub.id,
          name: hub.name,
        },
        quickNotes: {
          id: quickNote.id,
          content: quickNote.content,
          updatedAt: quickNote.updatedAt,
          hubId: quickNote.hubId,
        },
      })
      .from(hub)
      .where(eq(hub.userId, id))
      .leftJoin(quickNote, eq(quickNote.hubId, hub.id))
      .orderBy(desc(quickNote.updatedAt));

    // Group notes by hub
    const groupedByHub = hubsWithNotes.reduce((acc, item) => {
      const hubId = item.hub.id;

      // If this hub doesn't exist in our accumulator yet, add it
      if (!acc.has(hubId)) {
        acc.set(hubId, {
          hub: item.hub,
          notes: [],
        });
      }

      // Add the note to this hub's notes array (if it exists)
      if (item.quickNotes && item.quickNotes.id !== null) {
        acc.get(hubId)!.notes.push(item.quickNotes);
      }

      return acc;
    }, new Map());

    // Convert Map to array
    const result = Array.from(groupedByHub.values());

    console.log(result);

    return result;
  },
);

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

    const newNote = await db
      .insert(quickNote)
      .values({
        content: parsedInput.content,
        hubId: parsedInput.hubId,
        updatedAt: parsedInput.updatedAt,
        userId: id,
      })
      .returning();

    return newNote[0];
  });

export const getHubsWithNotesAction = protectedAction.action(
  async ({ ctx }) => {
    const {
      user: { id },
    } = ctx;
    const [userHubs, allNotes] = await Promise.all([
      db
        .select({
          id: hub.id,
          name: hub.name,
        })
        .from(hub)
        .where(eq(hub.userId, id)),

      db
        .select({
          id: quickNote.id,
          content: quickNote.content,
          updatedAt: quickNote.updatedAt,
          hubId: quickNote.hubId,
        })
        .from(quickNote)
        .where(eq(quickNote.userId, id))
        .orderBy(desc(quickNote.updatedAt)),
    ]);

    const allHubs = [{ id: 0, name: "General Notes" }, ...userHubs];

    const notesByHubId = allNotes.reduce((acc, note) => {
      if (!acc.has(note.hubId)) {
        acc.set(note.hubId, []);
      }
      acc.get(note.hubId)!.push(note);
      return acc;
    }, new Map<number, NoteSummary[]>());

    const hubsWithNotes = allHubs.map((hub) => ({
      hub,
      notes: notesByHubId.get(hub.id) || [],
    }));

    return hubsWithNotes;
  },
);
