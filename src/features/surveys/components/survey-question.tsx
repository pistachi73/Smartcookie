"use client";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Heading } from "@/shared/components/ui/heading";
import { Note } from "@/shared/components/ui/note";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { cn } from "@/shared/lib/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useSubmitSurvey } from "../hooks/use-submit-survey";
import { useSurveyNavigation } from "../hooks/use-survey-navigation";
import { getQuestionConfig } from "../lib/question-type-registry";
import { useSurveyStore } from "../store/survey-store-provider";
import type { getSurveyByIdUseCase } from "../use-cases/surveys.use-case";

interface SurveyQuestionProps {
  question: NonNullable<
    Awaited<ReturnType<typeof getSurveyByIdUseCase>>
  >["questions"][number];
  step: number;
}

export interface QuestionTypeProps {
  value: string;
  onChange: (val: string) => void;
}

export const SurveyQuestion = ({ question, step }: SurveyQuestionProps) => {
  const response = useSurveyStore((state) => state.responses);
  const setResponse = useSurveyStore((state) => state.setResponse);
  const totalQuestions = useSurveyStore((state) => state.totalQuestions);
  const goToNextStep = useSurveyStore((state) => state.goToNextStep);
  const responses = useSurveyStore((state) => state.responses);
  const surveyResponseId = useSurveyStore(
    (state) => state.surveyResponseData?.id,
  );
  const resetSurvey = useSurveyStore((state) => state.resetSurvey);

  const questionConfig = getQuestionConfig(question.type);
  const QuestionSpecificComponent = questionConfig.Component;
  const schema = questionConfig.generateSchema(question);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(
      z.object({
        [String(question.id)]: schema,
      }),
    ),
    defaultValues: {
      [String(question.id)]: response?.[question.id] || "",
    },
  });

  const { mutate: submitSurvey, isPending: isSubmitting } = useSubmitSurvey({
    onSuccess: () => {
      goToNextStep();
      resetSurvey();
    },
    onError: (message) => {
      form.setError(String(question.id), {
        message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    setResponse(question.id, data[String(question.id)]);
    if (isLastQuestion) {
      if (!surveyResponseId) {
        form.setError(String(question.id), {
          message: "Unexpected error, please try again",
        });
        return;
      }

      submitSurvey({
        surveyResponseId,
        responses,
      });
    } else {
      goToNextStep();
    }
  };

  useSurveyNavigation({
    onSubmit: () => {
      form.handleSubmit(onSubmit)();
    },
  });

  const isLastQuestion = step === totalQuestions;
  const fieldError = form.formState.errors[String(question.id)];
  const errorMessage =
    typeof fieldError?.message === "string" ? fieldError.message : undefined;

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="space-y-2 relative">
        <div className="absolute -left-7 md:-left-12 top-0 flex items-center gap-1 h-7 md:h-8">
          <span className="md:text-lg font-bold text-muted-fg tabular-nums text-xs">
            {step}
          </span>
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            className="text-muted-fg size-3 md:size-5"
          />
        </div>
        <Heading level={1} className="font-semibold">
          {question.title}
          {question.required && <span>*</span>}
        </Heading>
        <p className="mb-4 text-muted-fg first-letter:uppercase">
          {question.description}
        </p>
      </div>
      <FormProvider {...form}>
        <Form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          {QuestionSpecificComponent ? (
            <QuestionSpecificComponent questionId={question.id} />
          ) : (
            <Note intent="warning">
              Unsupported question type: {question.type}
            </Note>
          )}

          <div className="flex flex-row gap-3 items-center">
            <Button
              type="submit"
              size="large"
              className={cn("px-4 group gap-4")}
              isPending={isSubmitting}
            >
              {isLastQuestion ? "Submit" : "Next"}
              {isSubmitting ? (
                <ProgressCircle isIndeterminate />
              ) : (
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={20}
                  data-slot="icon"
                  className="group-hover:translate-x-0.5"
                />
              )}
            </Button>

            <span className="hidden md:block text-muted-fg text-xs">
              <span className="text-fg font-semibold mr-0.5">Enter ↵</span> to
              {isLastQuestion ? " submit" : " continue"}
            </span>
          </div>
          {errorMessage && (
            <Note
              intent="danger"
              className={{
                icon: "items-center",
                container: "w-fit py-3",
                content: "text-sm md:text-base",
              }}
            >
              {errorMessage}
            </Note>
          )}
        </Form>
      </FormProvider>
    </div>
  );
};
