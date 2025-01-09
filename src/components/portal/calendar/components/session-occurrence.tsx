import type { SessionOccurrence as SessionOccurrenceType } from "@/lib/generate-session-ocurrences";
import { cn } from "@/lib/utils";
import { parseDateTime } from "@internationalized/date";
import { format } from "date-fns";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { Button } from "react-aria-components";

type SessionOccurrenceProps = {
  occurrence: SessionOccurrenceType;
};

export const SessionOccurrence = ({
  occurrence,
  className,
  ...rest
}: SessionOccurrenceProps & React.HTMLAttributes<HTMLDivElement>) => {
  const params = useSearchParams();
  const router = useRouter();
  const { sessionId } = useParams();

  const [parsedStartTime, parsedEndTime] = [
    parseDateTime(occurrence.startTime),
    parseDateTime(occurrence.endTime),
  ];

  const top = parsedStartTime.hour + parsedStartTime.minute / 60;
  const bottom = parsedEndTime.hour + parsedEndTime.minute / 60;
  const height = bottom - top;

  const onNavigation = () => {
    router.push(`/calendar/session/${occurrence.id}`);
    // window.history.pushState(null, "", `/calendar/session/${occurrence.id}`);
  };

  const isSelected =
    typeof sessionId === "string" && Number(sessionId) === occurrence.id;

  return (
    <Button
      className={cn("absolute", className)}
      style={{
        top: `calc(${top}*var(--row-height)`,
        height: `calc(${height}*var(--row-height)`,
        ...rest.style,
      }}
      onPress={onNavigation}
    >
      <div
        className={cn(
          "h-full w-full bg-[#286552] brightness-100 flex flex-row rounded-md gap-2 overflow-hidden",
          "border border-transparent",
          isSelected && "brightness-100 border-responsive-dark/70 ",
        )}
      >
        <div className="h-full w-1 bg-responsive-dark/70 shrink-0" />
        <div className=" flex flex-col justify-between py-1.5 pr-2">
          <div className="text-left text-sm text-responsive-dark">
            <p className="line-clamp-2 font-normal leading-tight mb-0.5 text-xs">
              {occurrence.title}
            </p>
            <span className="line-clamp-1 text-text-sub text-xs">
              {format(occurrence.startTime, "HH:mm")} -{" "}
              {format(occurrence.endTime, "HH:mm")}
            </span>
          </div>
        </div>
      </div>
    </Button>
  );
};
