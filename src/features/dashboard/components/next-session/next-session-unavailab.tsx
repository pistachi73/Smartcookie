"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen02Icon,
  CalendarCheckOut02Icon,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-rounded";

import { buttonStyles } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Link } from "@/shared/components/ui/link";
import { Separator } from "@/shared/components/ui/separator";

import { NewHubButton } from "@/features/hub/components/hub-list/new-hub-button";

export const NextSessionUnavailable = () => {
  return (
    <Card className="shrink-0 flex flex-col h-full bg-overlay @container">
      <Card.Header className="flex flex-row items-center justify-between">
        <Card.Title className="flex gap-2 @2xl:gap-4 flex-col @2xl:items-center @2xl:flex-row">
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={CalendarCheckOut02Icon} size={18} />
            Upcoming Session
          </span>
          <Separator orientation="vertical" className="h-4 hidden @2xl:block" />
          <span className="text-sm @2xl:text-lg text-muted-fg">
            No sessions scheduled
          </span>
        </Card.Title>
      </Card.Header>

      <Card.Content>
        <EmptyState
          icon={BookOpen02Icon}
          title="No upcoming sessions"
          description="Get started by creating your first course and scheduling sessions with your students."
          action={
            <div className="flex flex-col sm:flex-row gap-3 mt-4 items-center justify-center">
              <NewHubButton size="sm">
                <HugeiconsIcon icon={PlusSignIcon} data-slot="icon" size={14} />
                Create your first course
              </NewHubButton>

              <Link
                href="/portal/hubs"
                className={buttonStyles({
                  intent: "outline",
                  size: "sm",
                })}
              >
                <HugeiconsIcon icon={BookOpen02Icon} data-slot="icon" />
                Browse courses
              </Link>
            </div>
          }
        />
      </Card.Content>
    </Card>
  );
};
