"use client";

import { AddNoteCard } from "@/features/notes/components/add-note-card";
import { NoteCardList } from "@/features/notes/components/note-card-list";
import { Heading } from "@/shared/components/ui/heading";
import { Tabs } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/classes";
import {
  CalendarIcon as CalendarIconSolid,
  Comment01Icon as Comment01IconSolid,
  UserMultiple02Icon as UserMultiple02IconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import {
  CalendarIcon,
  Comment01Icon,
  UserMultiple02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useHubById } from "../hooks/use-hub-by-id";
import { CourseCard } from "./course-card";
import { SessionsList } from "./session/session-list";

const mockCourse = {
  id: "A1",
  title: "Introduction to Web Development",
  status: "Active",
  description:
    "Learn the basics of HTML, CSS, and JavaScript to build responsive websites. This comprehensive course covers everything from basic syntax to advanced layout techniques. Students will build multiple projects and create a portfolio website.",
  schedule: "Mon, Wed, Fri",
  duration: "8 weeks",
  level: "Beginner",
};

const tabs: {
  id: string;
  label: string;
  icon: typeof UserMultiple02Icon;
  altIcon: typeof UserMultiple02IconSolid;
}[] = [
  {
    id: "students",
    icon: UserMultiple02Icon,
    altIcon: UserMultiple02IconSolid,
    label: "Students",
  },
  {
    id: "sessions",
    icon: CalendarIcon,
    altIcon: CalendarIconSolid,
    label: "Sessions",
  },
  {
    id: "feedback",
    icon: Comment01Icon,
    altIcon: Comment01IconSolid,
    label: "Feedback",
  },
];

export function HubDashboard({ hubId }: { hubId: number }) {
  const { data: hub } = useHubById(hubId);

  if (!hub) return null;

  return (
    <div className="min-h-0 h-full bg-bg overflow-auto">
      <div className="min-h-0 h-full grid grid-cols-1 lg:grid-cols-[3fr_1fr]">
        {/* Main Content - Takes up 2 columns */}
        <div className="">
          {/* Course Info Card */}
          <div className="p-5  rounded-lg ">
            <CourseCard />
          </div>

          <Tabs
            aria-label="Recipe App"
            className={"p-4"}
            defaultSelectedKey={"sessions"}
          >
            <Tabs.List className={"sticky top-0"}>
              {tabs.map((tab) => (
                <Tabs.Tab key={tab.id} id={tab.id}>
                  {({ isSelected }) => {
                    return (
                      <p className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={tab.icon}
                          altIcon={tab.altIcon}
                          showAlt={isSelected}
                          className={cn(isSelected && "text-primary")}
                          size={16}
                        />
                        {tab.label}
                      </p>
                    );
                  }}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <Tabs.Panel id="students" className={"p-4 pt-0"}>
              students
            </Tabs.Panel>
            <Tabs.Panel id="sessions" className={"sm:px-2 pt-0"}>
              <SessionsList hubId={hubId} />
            </Tabs.Panel>
            <Tabs.Panel id="feedback" className={"p-4 pt-0"}>
              Discover curated meal plans to simplify your weekly cooking.
            </Tabs.Panel>
          </Tabs>
        </div>

        {/* Sidebar - Takes up 1 column */}
        <div className="h-full min-h-0 space-y-6 p-4">
          {/* Quick Notes Section */}
          <div className="flex flex-row items-center justify-between gap-2">
            <Heading level={4}>Quick Notes</Heading>
            <AddNoteCard hubId={hubId} appearance="plain" />
          </div>
          <NoteCardList hubId={Number(hubId)} hubColor={hub.color} />
        </div>
      </div>
    </div>
  );
}
