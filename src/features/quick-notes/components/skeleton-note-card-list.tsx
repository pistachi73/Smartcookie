import { SkeletonNoteCard } from "./note-card/skeleton-note-card";

export const SkeletonNoteCardList = () => {
  return (
    <div className="flex flex-col gap-3 relative">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonNoteCard key={index} />
      ))}
    </div>
  );
};
