"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  InformationCircleIcon,
} from "@hugeicons-pro/core-stroke-rounded";

import { Keyboard } from "@/shared/components/ui/keyboard";
import { Link } from "@/shared/components/ui/link";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";

import { useSurveyStore } from "../store/survey-store-provider";

// Shortcuts are now local
export const shortcuts = [
  { key: "Enter  ↵", label: "Submit answer" },
  { key: "←", label: "Previous question" },
  { key: "→", label: "Next question" },
];

export const SurveyBottomBar = () => {
  const { up } = useViewport();
  const step = useSurveyStore((s) => s.step);
  const goToPrevStep = useSurveyStore((s) => s.goToPrevStep);
  const totalQuestions = useSurveyStore((s) => s.totalQuestions);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-overlay border-t px-4 py-4 flex items-center justify-between z-50 ">
      <Link
        intent="secondary"
        className="text-sm text-muted-fg flex items-center gap-2 cursor-pointer"
        onPress={goToPrevStep}
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
        Back
      </Link>
      <p className="text-sm font-medium text-muted-fg">
        {step} of {totalQuestions}
      </p>
      {up("md") && (
        <Tooltip delay={0} closeDelay={0}>
          <Tooltip.Trigger className="flex items-center gap-1 text-muted-fg text-base">
            <HugeiconsIcon icon={InformationCircleIcon} size={14} />
            Shortcuts
          </Tooltip.Trigger>
          <Tooltip.Content className="p-4">
            <div className="font-semibold text-muuted-fg mb-4 text-sm">
              Keyboard Shortcuts
            </div>
            <ul className="space-y-3">
              {shortcuts.map((s) => (
                <li
                  key={s.key}
                  className="flex items-center text-sm gap-8 justify-between"
                >
                  <span>{s.label}</span>
                  <Keyboard keys={s.key} className={{ base: "block" }} />
                </li>
              ))}
            </ul>
          </Tooltip.Content>
        </Tooltip>
      )}
    </div>
  );
};
