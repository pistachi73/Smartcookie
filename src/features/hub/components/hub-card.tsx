"use client";

import { AvatarStack } from "@/shared/components/ui/avatar-stack";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/classes";
import {
  getCustomColorClasses,
  hubCardColorStyleMap,
} from "@/shared/lib/custom-colors";
import {
  Calendar01Icon,
  Clock01Icon,
  UserMultiple02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
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
          "group h-full transition-all bg-overlay-highlight hover:bg-overlay-elevated",
          "flex flex-col justify-between",
          colorClasses.hover,
        )}
      >
        <Card.Header>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Badge className="text-xs py-1" intent="primary">
                {level}
              </Badge>
              <Badge intent={status === "active" ? "success" : "secondary"}>
                {status === "active" ? "Active" : "Inactive"}
              </Badge>
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
            <Card.Title level={2}>{name}</Card.Title>
          </div>
          <Card.Description className="text-base">
            {description}
          </Card.Description>
        </Card.Header>

        <Card.Content className="flex flex-col gap-5">
          <AvatarStack
            users={students}
            maxAvatars={5}
            className={{ avatar: "outline-overlay-highlight outline-2" }}
          />

          <Separator />
          <div className="grid grid-cols-2 gap-2 text-muted-fg">
            <p className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Calendar01Icon}
                size={20}
                className="text-muted-fg shrink-0"
              />

              <span className="line-clamp-1">{schedule}</span>
            </p>
            <p className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Clock01Icon}
                size={20}
                className="text-muted-fg shrink-0"
              />
              {duration === "unknown" ? "Unknown" : `${duration} weeks`}
            </p>
          </div>
        </Card.Content>
      </Card>
    </Link>
  );
}
