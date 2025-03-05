import { db } from "@/db";
import { hub } from "@/db/schema";
import { quickNote } from "@/db/schema/quick-note";
import { desc, eq } from "drizzle-orm";
import { PublicError } from "./errors";

/**
 * Retrieves all data needed for the quick notes page
 * @param userId The ID of the user to fetch quick notes for
 * @returns An array of quick notes for the user
 * @throws {PublicError} If there's an issue retrieving the notes
 */
export const getQuickNotesPageDataUseCase = async (userId: string) => {
  const hubsWithNotes = await db
    .select()
    .from(hub)
    .leftJoin(quickNote, eq(quickNote.hubId, hub.id))
    .where(eq(quickNote.userId, userId))
    .orderBy(desc(quickNote.updatedAt));

  console.log(hubsWithNotes);

  return hubsWithNotes;
};
