import { Badge, type BadgeProps } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/classes";

const getBarColor = (percentage: number) => {
  if (percentage === 0) return "bg-overlay-highlight";
  if (percentage >= 80) return "bg-success";
  if (percentage >= 50) return "bg-warning";
  return "bg-danger";
};

const getBadgeIntent = (percentage: number): BadgeProps["intent"] => {
  if (percentage === 0) return "secondary";
  if (percentage >= 80) return "success";
  if (percentage >= 50) return "warning";
  return "danger";
};

type AttendanceBarProps = {
  attendedSessions: number;
  totalSessions: number;
};

export const AttendanceBar = ({
  attendedSessions,
  totalSessions,
}: AttendanceBarProps) => {
  const percentage = Math.floor((attendedSessions / totalSessions) * 100) || 0;
  const barColor = getBarColor(percentage);
  const badgeIntent = getBadgeIntent(percentage);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-row items-end justify-between">
        <Badge intent={badgeIntent} className="text-xs px-1.5">
          {percentage}%
        </Badge>
        <p className="text-muted-fg font-medium text-xs">
          {attendedSessions} / {totalSessions} sessions
        </p>
      </div>
      <div
        role="presentation"
        className={cn("w-full h-2.5 rounded-full bg-muted relative")}
      >
        <div
          className={cn(
            "absolute inset-0 bg-overlay-highlight rounded-full",

            barColor,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
