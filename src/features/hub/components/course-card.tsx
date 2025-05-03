import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { Settings02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useHubById } from "../hooks/use-hub-by-id";

export function CourseCard() {
  const params = useParams();

  const hubId = params.hubId as string;

  const { data: hub } = useHubById(Number(hubId));

  if (!hub) return null;

  return (
    <div className="border  rounded-lg shadow-sm p-4 relative">
      <div className="flex justify-between items-center mb-4 ">
        <div className="flex items-center gap-4">
          <Heading level={1} className="text-2xl font-semibold">
            {hub.name}
          </Heading>
        </div>
        <Button
          size="square-petite"
          intent="plain"
          shape="square"
          className="absolute top-1 right-1 size-9"
        >
          <HugeiconsIcon icon={Settings02Icon} size={16} data-slot="icon" />
        </Button>
      </div>

      <p className="text-muted-fg mb-6">{hub?.description}</p>
    </div>
  );
}
