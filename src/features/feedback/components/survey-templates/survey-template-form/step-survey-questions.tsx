"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  ArrowUp01Icon,
  DeleteIcon,
  DragDropVerticalIcon,
  Settings01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { AnimatePresence, LayoutGroup, motion, Reorder } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDrop } from "react-aria";
import {
  type DroppableCollectionRootDropEvent,
  isTextDropItem,
} from "react-aria-components";

import { Button } from "@/shared/components/ui/button";
import { Popover } from "@/shared/components/ui/popover";
import { Separator } from "@/shared/components/ui/separator";
import { Switch } from "@/shared/components/ui/switch";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSurveyTemplateFormStore } from "../../../store/survey-template-form.store";
import type { FeedbackQuestion } from "../../questions/question-list-item";
import { TemplateQuestion } from "../template-question";

export function StepSurveyQuestions() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { createHrefWithParams } = useNavigateWithParams();
  const pathname = usePathname();
  const orderedQuestions = useSurveyTemplateFormStore(
    (state) => state.questions,
  );
  const nextStep = useSurveyTemplateFormStore((state) => state.nextStep);
  const prevStep = useSurveyTemplateFormStore((state) => state.prevStep);

  // Force the sidebar to show the questions tab
  useEffect(() => {
    // If tab is not questions, update the URL to show questions tab
    if (searchParams.get("tab") !== "questions") {
      router.push(
        createHrefWithParams(pathname, {
          tab: null,
        }),
      );
    }
  }, [createHrefWithParams, searchParams, router, pathname]);

  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{
          layout: regularSpring,
        }}
        className="flex flex-col gap-4"
      >
        <DroppableQuestionContainer />

        <motion.div
          layout
          transition={{
            layout: regularSpring,
          }}
          className="flex justify-between"
        >
          <Button intent="secondary" onPress={prevStep}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={16} data-slot="icon" />
            Back
          </Button>

          <Button onPress={nextStep} isDisabled={orderedQuestions.length === 0}>
            Next
            <HugeiconsIcon icon={ArrowRight02Icon} size={16} data-slot="icon" />
          </Button>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}

const DroppableQuestionContainer = () => {
  const addQuestion = useSurveyTemplateFormStore((state) => state.addQuestion);
  const questions = useSurveyTemplateFormStore((state) => state.questions);
  const reorderQuestions = useSurveyTemplateFormStore(
    (state) => state.reorderQuestions,
  );
  const removeQuestion = useSurveyTemplateFormStore(
    (state) => state.removeQuestion,
  );
  const updateQuestionSetting = useSurveyTemplateFormStore(
    (state) => state.updateQuestionSetting,
  );

  const handleMoveUp = (id: number) => {
    const index = questions.findIndex((q) => q.id === id);
    if (index <= 0) return;

    const newOrderedQuestions = [...questions];
    const item1 = newOrderedQuestions[index];
    const item2 = newOrderedQuestions[index - 1];

    if (item1 && item2) {
      newOrderedQuestions[index] = item2;
      newOrderedQuestions[index - 1] = item1;

      reorderQuestions(newOrderedQuestions);
    }
  };

  const handleMoveDown = (id: number) => {
    const index = questions.findIndex((q) => q.id === id);
    if (index < 0 || index >= questions.length - 1) return;

    const newOrderedQuestions = [...questions];
    const item1 = newOrderedQuestions[index];
    const item2 = newOrderedQuestions[index + 1];

    if (item1 && item2) {
      newOrderedQuestions[index] = item2;
      newOrderedQuestions[index + 1] = item1;

      reorderQuestions(newOrderedQuestions);
    }
  };

  const handleRemoveQuestion = (id: number) => {
    removeQuestion(id);
  };

  const getItems = async (e: DroppableCollectionRootDropEvent) => {
    return (await Promise.all(
      e.items
        .filter(isTextDropItem)
        .map(async (item) => {
          if (item.types.has("feedback-question")) {
            const question = await item.getText("feedback-question");
            return JSON.parse(question);
          }
          return null;
        })
        .filter(Boolean),
    )) as FeedbackQuestion[];
  };

  const ref = useRef(null);
  const { dropProps, isDropTarget } = useDrop({
    ref,

    async onDrop(e) {
      const [item] = await getItems(e);
      if (!item) return;
      addQuestion(item);
    },
  });

  return (
    //@ts-expect-error
    <motion.div
      layout
      transition={{
        layout: regularSpring,
      }}
      {...dropProps}
      ref={ref}
      className={cn(
        " rounded-lg w-[calc(100%+16px)] -translate-x-[8px] p-2 transition-colors gap-2 flex flex-col",
        isDropTarget && "outline outline-primary bg-primary-tint",
      )}
    >
      {questions.length === 0 ? (
        <motion.div
          layout
          transition={{
            layout: regularSpring,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border  rounded-lg p-6 flex flex-col gap-1 items-center justify-center "
        >
          <p className="font-medium">No questions selected</p>
          <p className="text-sm text-muted-fg">
            Select or drag questions from the sidebar to add them here
          </p>
        </motion.div>
      ) : (
        <Reorder.Group
          values={questions}
          onReorder={reorderQuestions}
          className="h-full flex flex-col  gap-2"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {questions.map((question, index) => {
              return (
                <Reorder.Item
                  key={`survey-question-${question.id}`}
                  value={question}
                  className={cn(
                    "bg-overlay border flex items-center rounded-lg ",
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    default: regularSpring,
                    layout: regularSpring,
                  }}
                >
                  <div className="p-4 py-3 rounded-lg w-full flex items-center bg-overlay">
                    <div className={cn("mr-3 text-muted-fg cursor-grab")}>
                      <HugeiconsIcon icon={DragDropVerticalIcon} size={18} />
                    </div>

                    <div className="flex items-center justify-between gap-6 w-full">
                      <TemplateQuestion
                        type={question.type}
                        order={index + 1}
                        title={question.title}
                        required={question.required}
                      />

                      <div className="flex gap-1">
                        <Button
                          intent="plain"
                          size="sq-sm"
                          className="size-7 flex sm:hidden"
                          onPress={() => handleMoveUp(question.id)}
                          isDisabled={index === 0}
                        >
                          <HugeiconsIcon icon={ArrowUp01Icon} size={16} />
                        </Button>
                        <Button
                          intent="plain"
                          size="sq-sm"
                          className="size-7 flex sm:hidden"
                          onPress={() => handleMoveDown(question.id)}
                          isDisabled={index === questions.length - 1}
                        >
                          <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
                        </Button>
                        <Popover>
                          <Button intent="plain" size="sq-xs">
                            <HugeiconsIcon icon={Settings01Icon} size={16} />
                          </Button>
                          <Popover.Content
                            showArrow
                            placement="bottom"
                            className={"w-[200px] [--gutter:--spacing(4)]"}
                          >
                            <Popover.Header>
                              <Popover.Title level={4}>Settings</Popover.Title>
                            </Popover.Header>
                            <Separator className="my-2" />
                            <Popover.Body className="w-full flex flex-col! gap-4 pb-[var(--gutter)]">
                              <Switch
                                className={
                                  "flex-row-reverse justify-between w-full"
                                }
                                isSelected={question.required}
                                onChange={(isRequired) => {
                                  updateQuestionSetting(question.id, {
                                    required: isRequired,
                                  });
                                }}
                              >
                                Required
                              </Switch>
                            </Popover.Body>
                          </Popover.Content>
                        </Popover>
                        <Button
                          intent="plain"
                          size="sq-sm"
                          className="size-7 text-danger"
                          onPress={() => handleRemoveQuestion(question.id)}
                        >
                          <HugeiconsIcon icon={DeleteIcon} size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              );
            })}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </motion.div>
  );
};
