import { relations } from "drizzle-orm";
import { integer, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { hub } from "./hub";
import { user } from "./user";
import { pgTable } from "./utils";

export const quickNote = pgTable("quick_note", {
  id: serial().primaryKey(),
  userId: uuid()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  hubId: integer()
    .references(() => hub.id, { onDelete: "cascade" })
    .notNull()
    .default(0),
  content: text().notNull(),
  createdAt: timestamp({ mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
});

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
