"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { AddIcon } from "@hugeicons-pro/core-stroke-rounded";

import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { Note } from "@/shared/components/ui/note";
import { useNavigateWithParams } from "@/shared/hooks/use-navigate-with-params";

export const FeedbackHall = () => {
  const { createHrefWithParams } = useNavigateWithParams();
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="space-y-2">
        <Heading level={2} className="text-2xl! text-center">
          Feedback Hall
        </Heading>
        <p className="text-sm text-muted-fg text-center text-balance max-w-[42ch]">
          Select a question or survey from the list, or create a new one with
          the options below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Link
          href={createHrefWithParams("/portal/feedback/questions/new")}
          className="hover:border-primary hover:bg-primary-tint transition-all border rounded-lg p-4"
        >
          <Heading
            level={3}
            className="text-base! w-fit flex items-center gap-2"
          >
            <HugeiconsIcon icon={AddIcon} size={18} />
            Create Question
          </Heading>
        </Link>

        <Link
          href={createHrefWithParams("/portal/feedback/survey-templates/new")}
          className="hover:border-primary hover:bg-primary-tint transition-all border rounded-lg p-4"
        >
          <Heading
            level={3}
            className="text-base! w-fit flex items-center gap-2"
          >
            <HugeiconsIcon icon={AddIcon} size={18} />
            Create Survey
          </Heading>
        </Link>
      </div>

      <Note intent="tip">
        <p className="font-medium text-base">Feedback Tips</p>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="">Keep questions clear and concise</li>
          <li>
            Use a mix of question types (multiple choice, rating, open-ended)
          </li>
          <li>Start with easy questions to build engagement</li>
          <li>Limit surveys to 5-7 questions for better completion rates</li>
          <li>Use rating scales consistently (e.g., 1-5 or 1-10)</li>
          <li>Include an optional comment field for additional insights</li>
        </ul>
      </Note>
    </div>
  );
};
