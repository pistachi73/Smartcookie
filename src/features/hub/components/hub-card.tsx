"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Archive02Icon,
  Calendar01Icon,
  Clock01Icon,
  HelpCircleIcon,
  SquareLock01Icon,
  UserMultiple02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { Link } from "react-aria-components";

import { AvatarStack } from "@/shared/components/ui/avatar-stack";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/classes";
import {
  getCustomColorClasses,
  hubCardColorStyleMap,
} from "@/shared/lib/custom-colors";

import { getHubDuration } from "../lib/utils";
import type { Hub } from "../types/hub.types";

interface HubCardProps {
  hub: Hub;
}

export function HubCard({ hub }: HubCardProps) {
  const {
    id,
    name,
    description,
    status,
    startDate,
    endDate,
    schedule,
    level,
    studentsCount,
    students,
  } = hub;

  const duration = endDate ? getHubDuration(startDate, endDate) : "unknown";
  const colorClasses = getCustomColorClasses(hub.color, hubCardColorStyleMap);

  return (
    <Link href={`/portal/hubs/${id}`} className="block h-full w-full">
      <Card
        className={cn(
          "shadow-sm hover:shadow-md group h-full transition-all duration-300 bg-overlay dark:hover:bg-overlay-highlight",
          "flex flex-col justify-between",
          colorClasses.hover,
        )}
      >
        <Card.Header>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge intent={status === "active" ? "success" : "secondary"}>
                  {status === "inactive" && (
                    <HugeiconsIcon icon={Archive02Icon} size={12} />
                  )}
                  {status === "active" ? "Active" : "Archived"}
                </Badge>
                {level && (
                  <Badge className="text-xs py-1" intent="primary">
                    {level}
                  </Badge>
                )}
              </div>
              <p className="text-muted-fg flex items-center gap-1">
                <HugeiconsIcon icon={UserMultiple02Icon} size={16} />
                {studentsCount}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn("w-3 h-3 rounded-full", colorClasses.dot)}
                title={`Color: ${hub.color}`}
              />
              <Card.Title className="flex items-center gap-2">
                {name}
                {status === "inactive" && (
                  <HugeiconsIcon
                    icon={SquareLock01Icon}
                    size={20}
                    className="text-muted-fg/60"
                  />
                )}
              </Card.Title>
            </div>
          </div>
          {description && (
            <Card.Description className="text-sm">
              {description}
            </Card.Description>
          )}
        </Card.Header>

        <Card.Content className="flex flex-col gap-5">
          {students.length > 0 ? (
            <AvatarStack
              users={students}
              maxAvatars={5}
              className={{ avatar: "outline-overlay outline-2" }}
            />
          ) : (
            <p className="text-muted-fg/70 italic flex items-center gap-1 text-sm">
              <HugeiconsIcon icon={UserMultiple02Icon} size={16} />
              No students yet
            </p>
          )}

          <Separator />
          <div className="grid grid-cols-2 gap-2 text-muted-fg text-sm">
            <p className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Calendar01Icon}
                altIcon={HelpCircleIcon}
                showAlt={!schedule}
                size={20}
                className="text-muted-fg shrink-0"
              />

              <span className="line-clamp-1">
                {schedule ?? "Flexible schedule"}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Clock01Icon}
                altIcon={HelpCircleIcon}
                showAlt={duration === "unknown"}
                size={20}
                className="text-muted-fg shrink-0"
              />
              {duration === "unknown" ? "Open-ended" : `${duration} weeks`}
            </p>
          </div>
        </Card.Content>
      </Card>
    </Link>
  );
}
