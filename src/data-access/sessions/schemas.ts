import { z } from "zod";
import { DatabaseTransactionSchema } from "../shared-schemas";

export const GetSessionsByHubIdSchema = z.object({
  hubId: z.number(),
});

export const AddSessionsSchema = z.object({
  sessions: z.array(
    z.object({
      startTime: z.string(),
      endTime: z.string(),
    }),
  ),
  hubId: z.number(),
  trx: DatabaseTransactionSchema,
});

export const UpdateSessionSchema = z.object({
  sessionId: z.number(),
  hubId: z.number(),
  data: z.object({
    startTime: z.string(),
    endTime: z.string(),
    status: z.enum(["upcoming", "completed", "cancelled"]),
  }),
});

export const DeleteSessionsSchema = z.object({
  sessionIds: z.array(z.number()),
});

export const CheckSessionConflictsSchema = AddSessionsSchema.pick({
  sessions: true,
}).extend({
  excludedSessionIds: z.array(z.number()).optional(),
});
