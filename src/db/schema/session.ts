import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { attendance } from "./attendance";
import { hub } from "./hub";
import { sessionException } from "./session-exception";
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
  isRecurring: boolean("is_recurring").default(false),
  recurrenceRule: jsonb("recurrence_rule").$type<RecurrenceRule>(),
});

export const sessionRelations = relations(session, ({ one, many }) => ({
  hub: one(hub, {
    fields: [session.hubId],
    references: [hub.id],
  }),
  attendances: many(attendance),
  exceptions: many(sessionException),
}));

export type RecurrenceRuleFrequency = "daily" | "weekly" | "monthly";
export type DayOfWeek = "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";
export type RecurrenceRule = {
  frequency: RecurrenceRuleFrequency;
  interval: number;
  daysOfWeek: DayOfWeek[];
};

export type InsertSession = typeof session.$inferInsert;
export type Session = typeof session.$inferSelect;
