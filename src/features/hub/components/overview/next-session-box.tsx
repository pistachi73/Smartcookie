"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Clock01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { addDays, format, formatDistanceToNow } from "date-fns";

import { Card } from "@/shared/components/ui/card";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

// Mock data for the next session
const mockNextSession = {
  id: 1,
  hubId: 1,
  hub: {
    name: "Advanced React Patterns",
    color: "blue",
  },
  startTime: addDays(new Date(), 2).toISOString(), // 2 days from now
  endTime: addDays(new Date(), 2).toISOString(), // Same day, will adjust time
  status: "upcoming" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Adjust the mock session times to be more realistic
const adjustedMockSession = {
  ...mockNextSession,
  startTime: (() => {
    const start = addDays(new Date(), 2);
    start.setHours(14, 0, 0, 0); // 2:00 PM
    return start.toISOString();
  })(),
  endTime: (() => {
    const end = addDays(new Date(), 2);
    end.setHours(16, 0, 0, 0); // 4:00 PM
    return end.toISOString();
  })(),
};

export function NextSessionBox() {
  const session = adjustedMockSession;
  const colorClasses = getCustomColorClasses(session.hub.color);

  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);

  const timeUntilSession = formatDistanceToNow(startDate, { addSuffix: true });
  const sessionDate = format(startDate, "EEEE, MMMM d");
  const sessionTime = `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`;

  return (
    <Card className="w-full">
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colorClasses.bg}`} />
          Next Session
        </Card.Title>
        <Card.Description>Your upcoming session details</Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-fg mb-2">
            {session.hub.name}
          </h3>
          <p className="text-sm text-muted-fg">{timeUntilSession}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
              <HugeiconsIcon
                icon={Calendar01Icon}
                size={16}
                className="text-muted-fg"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{sessionDate}</p>
              <p className="text-xs text-muted-fg">Session date</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
              <HugeiconsIcon
                icon={Clock01Icon}
                size={16}
                className="text-muted-fg"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{sessionTime}</p>
              <p className="text-xs text-muted-fg">Duration: 2 hours</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-fg">Status</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}
            >
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
