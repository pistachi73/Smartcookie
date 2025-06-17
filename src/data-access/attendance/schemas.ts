import { z } from "zod";
import { DatabaseTransactionSchema } from "../shared-schemas";

export const AddAttendanceSchema = z.object({
  data: z.object({
    sessionIds: z.array(z.number()),
    studentIds: z.array(z.number()),
    hubId: z.number(),
  }),
  trx: DatabaseTransactionSchema,
});

export const RemoveAllStudentAttendanceSchema = z.object({
  data: z.object({
    studentId: z.number(),
    hubId: z.number(),
  }),
  trx: DatabaseTransactionSchema,
});
