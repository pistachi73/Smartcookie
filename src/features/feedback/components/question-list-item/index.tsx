"use client";
import { Link } from "@/shared/components/ui/link";
import { useParams, usePathname } from "next/navigation";
import type { getQuestionsUseCase } from "../../use-cases/feedback.use-case";

import { Button } from "@/shared/components/ui/button";
import { Menu } from "@/shared/components/ui/menu";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import { cn } from "@/shared/lib/classes";
import {
  BubbleChatEditIcon,
  Delete01Icon,
  DragDropVerticalIcon,
  MoreVerticalIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef } from "react";
import { DragPreview, useButton, useDrag } from "react-aria";
import { Button as RAButton } from "react-aria-components";
import { useCreateSurveyFormStore } from "../../store/create-survey-multistep-form.store";
import { QuestionTypeBadge } from "../question-type-badge";

const baseQuestionItemClasses = "relative flex flex-row gap-4 p-5";

export type FeedbackQuestion = Awaited<
  ReturnType<typeof getQuestionsUseCase>
>["questions"][number];

type QuestionListItemProps = {
  question: FeedbackQuestion;
};

export const QuestionListItem = ({ question }: QuestionListItemProps) => {
  const pathname = usePathname();
  const createSurveyStep = useCreateSurveyFormStore(
    (state) => state.currentStep,
  );

  const isSurveyStep =
    createSurveyStep === 2 && pathname === "/portal/feedback/surveys/new/";

  return isSurveyStep ? (
    <DraggableQuestionItem question={question} />
  ) : (
    <NotDraggableQuestionListItem question={question} />
  );
};

export const NotDraggableQuestionListItem = ({
  question,
}: QuestionListItemProps) => {
  const params = useParams();
  const { createHrefWithParams } = useNavigateWithParams();

  const { questionId } = params;

  const isActive = Number(questionId) === question.id;

  const href = createHrefWithParams(
    isActive ? "/portal/feedback" : `/portal/feedback/questions/${question.id}`,
  );

  return (
    <Link
      key={`question-${question.id}`}
      href={href}
      className={cn(baseQuestionItemClasses, "group", {
        "bg-primary-tint": isActive,
        "before:absolute before:inset-0 before:z-10 before:w-[3px] before:h-full before:bg-primary":
          isActive,
      })}
    >
      <div className="w-full flex justify-between items-center ">
        <div className="flex-1 flex items-center gap-3">
          <QuestionTypeBadge type={question.type} />
          <div className="space-y-0.5">
            <p className="font-medium text-sm text-balance">{question.title}</p>
            <p className="tabular-nums text-muted-fg text-xs">
              {question.answerCount} responses
            </p>
          </div>
        </div>
        <Menu>
          <Button
            intent="plain"
            shape="square"
            size="square-petite"
            className={
              "sm:opacity-0 group-hover:opacity-100 size-8 data-pressed:opacity-100"
            }
          >
            <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
          </Button>
          <Menu.Content placement="bottom end">
            <Menu.Item className="gap-1">
              <HugeiconsIcon
                icon={BubbleChatEditIcon}
                size={16}
                data-slot="icon"
              />
              <Menu.Label>Edit</Menu.Label>
            </Menu.Item>
            <Menu.Item className="gap-1">
              <HugeiconsIcon icon={Delete01Icon} size={16} data-slot="icon" />
              <Menu.Label>Delete</Menu.Label>
            </Menu.Item>
          </Menu.Content>
        </Menu>
      </div>
    </Link>
  );
};

const DraggableQuestionItem = ({ question }: QuestionListItemProps) => {
  const preview = useRef(null);
  const dragButtonRef = useRef(null);

  const isSelectedIndex = useCreateSurveyFormStore((state) =>
    state.questions.findIndex((q) => q.id === question.id),
  );
  const addQuestion = useCreateSurveyFormStore((state) => state.addQuestion);
  const removeQuestion = useCreateSurveyFormStore(
    (state) => state.removeQuestion,
  );

  const { dragProps, isDragging, dragButtonProps } = useDrag({
    hasDragButton: true,
    preview,
    getItems() {
      return [
        {
          "feedback-question": JSON.stringify(question),
          content: question.title,
        },
      ];
    },
  });

  const { buttonProps } = useButton(
    { ...dragButtonProps, elementType: "div" },
    dragButtonRef,
  );

  return (
    <>
      <div
        key={`question-${question.id}`}
        className={cn(
          baseQuestionItemClasses,
          "w-full pr-4 inset-ring-2  transition-colors items-center inset-ring-transparent focus-visible:inset-ring-primary",
          isDragging || isSelectedIndex >= 0
            ? "bg-bg dark:bg-overlay-highlight"
            : "cursor-grab",
        )}
        {...dragProps}
      >
        <span
          {...buttonProps}
          ref={dragButtonRef}
          className="rounded-xs focus-visible:ring-2 p-0.5 mr-0.5 ring-primary "
        >
          <HugeiconsIcon
            icon={DragDropVerticalIcon}
            size={16}
            className="shrink-0"
          />
        </span>

        <div className="flex-1 flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <QuestionTypeBadge type={question.type} />
            <div className="space-y-0.5">
              <p className="font-medium text-sm text-balance">
                {question.title}
              </p>
              <p className="tabular-nums text-muted-fg text-xs">
                {question.answerCount} responses
              </p>
            </div>
          </div>
          <RAButton
            onPress={() => {
              if (isSelectedIndex >= 0) {
                removeQuestion(question.id);
              } else {
                addQuestion(question);
              }
            }}
            className={cn(
              "cursor-pointer border shrink-0 size-9 flex items-center rounded-sm justify-center bg-bg",
              "outline-primary outline-0 outline-offset-2 hover:no-underline focus-visible:outline-2",
              "transition-colors",
              isSelectedIndex >= 0
                ? "bg-primary-tint border-primary"
                : "hover:bg-overlay-highlight hover:border-fg",
            )}
          >
            {isSelectedIndex >= 0 && (
              <p className="font-medium">{isSelectedIndex + 1}</p>
            )}
          </RAButton>
        </div>
      </div>
      <DragPreview ref={preview}>
        {(items) => (
          <div className="max-w-[400px] bg-overlay border p-3 rounded-sm shadow-xs opacity-100 flex items-center gap-3">
            <QuestionTypeBadge type={question.type} />
            <p className="font-medium">{items[0]!.content}</p>
          </div>
        )}
      </DragPreview>
    </>
  );
};
