import { queryOptions } from "@tanstack/react-query";

import { getUserQuickNoteCount } from "@/data-access/quick-notes/queries";

export const getUserQuickNoteCountQueryOptions = queryOptions({
  queryKey: ["user-quick-note-count"],
  queryFn: getUserQuickNoteCount,
});
