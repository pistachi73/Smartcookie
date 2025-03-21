"use server";
import { protectedAction } from "@/shared/lib/safe-action";
import {
  AddQuickNoteSchema,
  addQuickNoteUseCase,
} from "./use-cases/add-quick-note";
import {
  DeleteQuickNoteSchema,
  deleteQuickNoteUseCase,
} from "./use-cases/delete-quick-note";
import {
  GetHubNotesSchema,
  getHubNotesUseCase,
} from "./use-cases/get-hub-notes";
import { getHubsByUserIdUseCase } from "./use-cases/get-hubs-by-user-id";
import {
  UpdateQuickNoteSchema,
  updateQuickNoteUseCase,
} from "./use-cases/update-quick-note";

export const getHubsAction = protectedAction.action(async ({ ctx }) => {
  const {
    user: { id },
  } = ctx;

  return await getHubsByUserIdUseCase(id);
});

export const getHubNotesAction = protectedAction
  .schema(GetHubNotesSchema)
  .action(async ({ ctx, parsedInput }) => {
    const {
      user: { id },
    } = ctx;

    return await getHubNotesUseCase({
      userId: id,
      hubId: parsedInput.hubId,
    });
  });

export const addQuickNoteAction = protectedAction
  .schema(AddQuickNoteSchema.omit({ userId: true }))
  .action(async ({ ctx, parsedInput }) => {
    const {
      user: { id },
    } = ctx;

    return await addQuickNoteUseCase({
      userId: id,
      hubId: parsedInput.hubId,
      content: parsedInput.content,
      updatedAt: parsedInput.updatedAt,
    });
  });

export const updateQuickNoteAction = protectedAction
  .schema(UpdateQuickNoteSchema)
  .action(async ({ ctx, parsedInput }) => {
    const {
      user: { id },
    } = ctx;

    return await updateQuickNoteUseCase({
      userId: id,
      id: parsedInput.id,
      content: parsedInput.content,
      updatedAt: parsedInput.updatedAt,
    });
  });

export const deleteQuickNoteAction = protectedAction
  .schema(DeleteQuickNoteSchema)
  .action(async ({ ctx, parsedInput }) => {
    const {
      user: { id },
    } = ctx;

    return await deleteQuickNoteUseCase({
      userId: id,
      id: parsedInput.id,
    });
  });
