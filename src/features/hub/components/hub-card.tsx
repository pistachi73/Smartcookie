"use client";

import type { Hub } from "@/db/schema";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  CalendarIcon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { getHubDuration } from "../lib/utils";

interface HubCardProps {
  hub: Hub;
  onSelect?: (hub: Hub) => void;
}

export function HubCard({ hub, onSelect }: HubCardProps) {
  const { id, name, description, createdAt, status, startDate, endDate } = hub;

  const duration = getHubDuration(startDate, endDate);

  return (
    <Link href={`/portal/hubs/${id}`} className="block h-full">
      <Card className="group h-full transition-all rounded-none border-dashed hover:border-primary bg-transparent hover:bg-overlay-highlight">
        <Card.Header>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="text-xs py-1" intent="primary">
              {hub.level}
            </Badge>
            <Badge intent={status === "active" ? "success" : "secondary"}>
              {status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
          <Card.Title level={3}>{name}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </Card.Header>

        <Card.Content className="border-t">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={CalendarIcon} size={16} />
            <p className="text-sm text-muted-foreground">{duration} weeks</p>
          </div>
        </Card.Content>

        <Card.Footer className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <HugeiconsIcon
              icon={UserGroupIcon}
              size={16}
              className="text-muted-foreground"
            />
            {/* <span>{membersCount} members</span> */}
          </div>

          {/* Use a regular div with onClick for the button */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onSelect) onSelect(hub);
            }}
          >
            <Button intent="secondary" size="extra-small">
              View Details
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Link>
  );
}
