import { z } from "zod";

export const GetSessionNotesUseCaseSchema = z.object({
  sessionId: z.number(),
});

export const CreateSessionNoteUseCaseSchema = z.object({
  sessionId: z.number(),
  content: z.string().min(1, "Content is required"),
  position: z.enum(["past", "present", "future"]),
});

export const DeleteSessionNoteUseCaseSchema = z.object({
  noteId: z.number(),
  sessionId: z.number(),
});

export const UpdateSessionNoteUseCaseSchema = z.object({
  noteId: z.number(),
  source: z.object({
    sessionId: z.number(),
    position: z.enum(["past", "present", "future"]),
  }),
  target: z.object({
    sessionId: z.number(),
    position: z.enum(["past", "present", "future"]),
  }),
});
