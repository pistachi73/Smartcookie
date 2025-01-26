import { relations } from "drizzle-orm";
import { index, serial, unique } from "drizzle-orm/pg-core";
import { client } from "./client";
import { hub } from "./hub";
import { pgTable } from "./utils";

export const clientHub = pgTable(
  "client_hub",
  {
    id: serial().primaryKey(),
    clientId: serial()
      .notNull()
      .references(() => client.id, { onDelete: "cascade" }),
    hubId: serial()
      .notNull()
      .references(() => hub.id, { onDelete: "cascade" }),
  },
  (t) => ({
    clientIdIdx: index().on(t.clientId),
    hubIdIdx: index().on(t.hubId),
    unq: unique().on(t.clientId, t.hubId),
  }),
);

export const clientHubRelations = relations(clientHub, ({ one }) => ({
  client: one(client, {
    fields: [clientHub.clientId],
    references: [client.id],
  }),
  hub: one(hub, {
    fields: [clientHub.hubId],
    references: [hub.id],
  }),
}));
