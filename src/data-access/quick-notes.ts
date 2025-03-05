import { db } from "@/db";
import { type InsertQuickNote, quickNote } from "@/db/schema/quick-note";
import { eq } from "drizzle-orm";

export const getQuickNotes = async () => {
  const notes = await db.query.quickNote.findMany();
  return notes;
};

export const createQuickNote = async (note: InsertQuickNote) => {
  const [newNote] = await db.insert(quickNote).values(note).returning();
  return newNote;
};

export const updateQuickNote = async (id: number, note: InsertQuickNote) => {
  const [updatedNote] = await db
    .update(quickNote)
    .set(note)
    .where(eq(quickNote.id, id))
    .returning();
  return updatedNote;
};

export const deleteQuickNote = async (id: number) => {
  await db.delete(quickNote).where(eq(quickNote.id, id));
};

export const getQuickNoteById = async (id: number) => {
  const note = await db.query.quickNote.findFirst({
    where: eq(quickNote.id, id),
  });
  return note;
};
