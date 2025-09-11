import { SkeletonNoteCard } from "./note-card/skeleton-note-card";

export const NoteCardListLoading = () => {
  return (
    <div className="w-full @container">
      <div className="columns-1 @lg:columns-2 @4xl:columns-3 gap-3 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonNoteCard key={index} />
        ))}
      </div>
    </div>
  );
};
