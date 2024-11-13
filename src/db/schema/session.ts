import { relations } from "drizzle-orm";
import { boolean, integer, serial, text, timestamp } from "drizzle-orm/pg-core";
import { attendance } from "./attendance";
import { hub } from "./hub";
import { pgTable } from "./utils";

export const session = pgTable("session", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  hubId: serial("hub_id")
    .notNull()
    .references(() => hub.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time", { mode: "date" }).notNull(),
  endTime: timestamp("end_time", { mode: "date" }).notNull(),
  price: integer("price").notNull(),
  canceled: boolean("canceled").default(false),
  cancelationReason: text("cancelation_reason"),
  cancelationTime: timestamp("cancelation_time", { mode: "date" }),
});

export const sessionRelations = relations(session, ({ one, many }) => ({
  hub: one(hub, {
    fields: [session.hubId],
    references: [hub.id],
  }),
  attendances: many(attendance),
}));

export type InsertSession = typeof session.$inferInsert;
export type Session = typeof session.$inferSelect;
