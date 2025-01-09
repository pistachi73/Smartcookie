import { format } from "date-fns";

export const MonthViewOccurrence = ({
  occurrence,
}: {
  occurrence: any;
}) => {
  const today = new Date();
  return (
    <div
      key={occurrence.id}
      className="min-w-0 w-full h-6 p-0.5 px-1 rounded-md text-text-base text-sm hover:bg-base-highlight flex gap-1 items-center transition-colors cursor-pointer"
    >
      <div className="size-1 bg-lime-300 rounded-full shrink-0" />
      <p className="text-xs text-left text-text-base line-clamp-1">
        <span className="text-text-sub">
          {format(today, "HH:mm")}
          {/* {format(occurrence.startTime, "HH:mm")} */}
        </span>{" "}
        - Occurrence title
        {/* - {occurrence.title} */}
      </p>
    </div>
  );
};
