import { z } from "zod";

export const GetSessionNotesBySessionIdSchema = z.object({
  sessionId: z.number(),
});

export const CreateSessionNoteSchema = z.object({
  sessionId: z.number(),
  content: z.string().min(1, "Content is required"),
  position: z.enum(["plans", "in-class"]),
});

export const DeleteSessionNoteSchema = z.object({
  noteId: z.number(),
  sessionId: z.number(),
});

export const UpdateSessionNoteSchema = z.object({
  noteId: z.number(),
  source: z.object({
    sessionId: z.number(),
    position: z.enum(["plans", "in-class"]),
  }),
  target: z.object({
    sessionId: z.number(),
    position: z.enum(["plans", "in-class"]),
  }),
});
