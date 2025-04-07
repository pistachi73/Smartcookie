import { useDeviceType } from "@/shared/components/layout/device-only/device-only-provider";
import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";
import {
  Add01Icon,
  Clock05Icon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { LayoutGroup } from "motion/react";
import * as m from "motion/react-m";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useHubSessions } from "../../hooks/use-hub-sessions";
import { Session } from "./session";

const DynamicSessionFormModal = dynamic(
  () => import("./session-form-modal").then((mod) => mod.SessionFormModal),
  {
    ssr: false,
  },
);

export function SessionsList({ hubId }: { hubId: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: sessions } = useHubSessions({ hubId });
  const { isMobile } = useDeviceType();
  return (
    <>
      <div className="py-2">
        <div className="flex flex-row items-center justify-between mb-6">
          <Heading level={2}>Sessions timeline</Heading>
          <Button
            shape="square"
            size="small"
            onPress={() => setIsModalOpen(true)}
          >
            <HugeiconsIcon icon={Add01Icon} size={14} data-slot="icon" />
            <p>Add session</p>
          </Button>
        </div>

        <m.div layout>
          <LayoutGroup>
            {sessions?.map((session, index) => (
              <m.div
                layout
                transition={{
                  layout: regularSpring,
                }}
                key={`session-${session.id}`}
                className="sm:flex gap-4"
              >
                {!isMobile && (
                  <m.div
                    layout
                    className="hidden sm:flex flex-col items-center"
                  >
                    <m.div
                      layout
                      className={cn(
                        "w-1 h-2.5 shrink-0",
                        index === 0
                          ? "bg-transparent"
                          : "bg-bg dark:bg-overlay-highlight",
                      )}
                    />

                    <m.div
                      layout
                      className={cn(
                        "flex items-center justify-center shrink-0 border",
                        "size-8 rounded-full bg-primary",
                        session.status === "completed" &&
                          "bg-green-400 text-green-950 border-green-700 dark:bg-green-900 dark:text-green-200",
                        session.status === "upcoming" &&
                          "bg-blue-400 text-blue-950 border-blue-700 dark:bg-blue-900/50 dark:text-blue-100",
                      )}
                    >
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        altIcon={Clock05Icon}
                        showAlt={session.status === "upcoming"}
                        strokeWidth={1.5}
                        size={16}
                      />
                    </m.div>
                    <m.div
                      layout
                      transition={{
                        layout: regularSpring,
                      }}
                      className={cn(
                        "w-1 h-[calc(100%+10rem)]",
                        index === sessions.length - 1
                          ? "bg-transparent"
                          : "bg-bg dark:bg-overlay-highlight",
                      )}
                    />
                  </m.div>
                )}
                <Session
                  key={session.id}
                  session={session}
                  position={index + 1}
                />
              </m.div>
            ))}
          </LayoutGroup>
        </m.div>
      </div>
      <DynamicSessionFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        hubId={hubId}
      />
    </>
  );
}
