import { LoadingTabs } from "@/shared/components/ui/tabs/loading-tabs";
import { cn } from "@/shared/lib/classes";

import { TABS } from "../lib/constants";
import { HubDashboardLayout } from "./hub-dashboard-layout";
import { HubNotesCardLoading } from "./notes/hub-notes-card-loading";
import { HubSessionsLoading } from "./session/hub-sessions-loading";

export const HubLoading = () => {
  return (
    <HubDashboardLayout>
      <div className="flex-1 flex flex-col lg:flex-row p-0 sm:p-6 sm:pt-0 gap-6 h-full">
        <div className="bg-white sm:rounded-lg border flex-1">
          <LoadingTabs
            aria-label="Course Dashboard"
            className="flex-1 gap-4 sm:gap-6 h-full"
          >
            <LoadingTabs.List className={"px-4 sm:px-6 h-10 "}>
              {TABS.map((tab) => {
                return (
                  <LoadingTabs.Tab
                    key={tab.id}
                    id={tab.id}
                    className={cn(
                      "px-2 pb-0!",
                      tab.id === "quick-notes" && "lg:hidden",
                    )}
                  >
                    {({ isSelected }) => {
                      return (
                        <p
                          className={cn(
                            "flex items-center gap-2",
                            isSelected && "text-primary",
                          )}
                        >
                          {tab.label}
                        </p>
                      );
                    }}
                  </LoadingTabs.Tab>
                );
              })}
            </LoadingTabs.List>

            <LoadingTabs.Panel
              id="sessions"
              className={"px-4 sm:px-6 bg-white"}
            >
              <HubSessionsLoading />
            </LoadingTabs.Panel>
          </LoadingTabs>
        </div>

        <div className="w-full lg:w-[350px] hidden lg:flex">
          <HubNotesCardLoading />
        </div>
      </div>
    </HubDashboardLayout>
  );
};
