import { cn } from "@/shared/lib/classes";
import { getTimeLabelFromSnapIndex } from "../hooks/use-drag-to-create-event";

export const PreDraftEvent = ({
  startIndex,
  endIndex,
}: {
  startIndex: number;
  endIndex: number;
}) => {
  const realStartIndex = Math.min(startIndex, endIndex);
  const realEndIndex = Math.max(startIndex, endIndex);

  const height = Math.abs(endIndex - startIndex);
  const isShortEvent = height < 4;

  const startTimeLabel = getTimeLabelFromSnapIndex(realStartIndex);
  const endTimeLabel = getTimeLabelFromSnapIndex(realEndIndex);

  return (
    <div
      className="absolute left-0 right-0 z-30 pb-0.5 pr-1"
      style={{
        top: `calc(var(--row-height) / 4 * ${realStartIndex})`,
        height: `calc(var(--row-height) / 4 * ${height})`,
      }}
    >
      <div
        className={cn(
          "flex border px-1.5 h-full border-fg/70 bg-overlay-elevated-highlight/70 w-full overflow-hidden",
          isShortEvent
            ? "rounded-sm flex-row justify-between gap-1 items-center"
            : "rounded-md flex-col py-1.5 gap-0.5",
        )}
      >
        <p className="truncate font-semibold leading-tight text-xs">Untitled</p>

        <p
          className={cn("text-current/70 text-xs", !isShortEvent && "truncate")}
        >
          {isShortEvent
            ? startTimeLabel
            : `${startTimeLabel} - ${endTimeLabel}`}
        </p>
      </div>
    </div>
  );
};
