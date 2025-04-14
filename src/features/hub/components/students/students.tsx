import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { Toggle, ToggleGroup } from "@/shared/components/ui/toggle-group";
import {
  DashboardSquare01Icon,
  DeleteIcon,
  LeftToRightListBulletIcon,
  UserAdd02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { StudentsCardView } from "./students-card-view";
import { StudentsListView } from "./students-list-view";

export const Students = ({ hubId }: { hubId: number }) => {
  const [view, setView] = useState<"list" | "grid">("list");
  return (
    <div className="py-2 min-h-0">
      <div className="flex flex-row items-center justify-between mb-6 flex-wrap gap-3">
        <Heading level={2}>Students</Heading>
        <div className="flex gap-2">
          <ToggleGroup
            selectedKeys={[view]}
            selectionMode="single"
            onSelectionChange={(value) => {
              const view = Array.from(value)[0];
              if (!view) return;
              setView(view as "list" | "grid");
            }}
          >
            <Toggle id="list">
              <HugeiconsIcon
                icon={LeftToRightListBulletIcon}
                data-slot="icon"
              />
              List View
            </Toggle>
            <Toggle id="grid">
              <HugeiconsIcon icon={DashboardSquare01Icon} data-slot="icon" />
              Card View
            </Toggle>
          </ToggleGroup>
          <Button
            shape="square"
            size="small"
            intent="primary"
            className={"w-[160px]"}
          >
            <HugeiconsIcon
              icon={UserAdd02Icon}
              altIcon={DeleteIcon}
              size={16}
              data-slot="icon"
            />
            <p>Add student</p>
          </Button>
        </div>
      </div>
      {view === "list" ? (
        <StudentsListView hubId={hubId} />
      ) : (
        <StudentsCardView hubId={hubId} />
      )}
    </div>
  );
};
