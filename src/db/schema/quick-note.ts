import { relations } from "drizzle-orm";
import { integer, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { hub } from "./hub";
import { user } from "./user";
import { pgTable } from "./utils";

export const quickNote = pgTable(
  "quick_note",
  {
    id: serial().primaryKey(),
    userId: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    hubId: integer().references(() => hub.id, { onDelete: "cascade" }),
    content: varchar({ length: 1000 }).notNull(),
    createdAt: timestamp({ mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ mode: "string", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [],
);

export type InsertQuickNote = typeof quickNote.$inferInsert;
export type QuickNote = typeof quickNote.$inferSelect;

export const quickNoteRelations = relations(quickNote, ({ one }) => ({
  hub: one(hub, {
    fields: [quickNote.hubId],
    references: [hub.id],
  }),
  user: one(user, {
    fields: [quickNote.userId],
    references: [user.id],
  }),
}));
