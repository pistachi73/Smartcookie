"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Heading } from "@/shared/components/ui/heading";
import { Note } from "@/shared/components/ui/note";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { TextField } from "@/shared/components/ui/text-field";

import { isDataAccessError } from "@/data-access/errors";
import { useStudentHasSurveyAccess } from "../hooks/use-student-has-survey-access";
import { useSurvey } from "../hooks/use-survey";
import { useSurveyNavigation } from "../hooks/use-survey-navigation";
import { useSurveyStore } from "../store/survey-store-provider";

interface SurveyPresentationProps {
  surveyId: string;
}

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(1, {
    message: "Email is required ksds",
  }),
});

export const SurveyPresentation = ({ surveyId }: SurveyPresentationProps) => {
  const { data: survey } = useSurvey(surveyId);
  const surveyResponseData = useSurveyStore(
    (state) => state.surveyResponseData,
  );
  const goToNextStep = useSurveyStore((state) => state.goToNextStep);
  const setSurveyResponseData = useSurveyStore(
    (state) => state.setSurveyResponseData,
  );
  const setIsTransitioning = useSurveyStore(
    (state) => state.setIsTransitioning,
  );
  const isTransitioning = useSurveyStore((state) => state.isTransitioning);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: surveyResponseData.email || "",
    },
  });

  const {
    mutateAsync: checkStudentHasSurveyAccess,
    isPending,
    data: accessData,
    reset,
  } = useStudentHasSurveyAccess();

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const res = await checkStudentHasSurveyAccess({
      email: data.email,
      surveyId,
    });

    if (isDataAccessError(res)) {
      setIsTransitioning(false);
      return;
    }

    goToNextStep();
    setSurveyResponseData({
      email: data.email,
      id: res?.id,
      studentId: res?.studentId,
      surveyTemplateId: survey?.id,
      startedAt: res?.startedAt || new Date().toISOString(),
    });
  };

  useSurveyNavigation({
    onSubmit: form.handleSubmit(onSubmit),
  });

  const error = form.formState.errors.email?.message;

  return (
    <div className="flex flex-col gap-8 items-center max-w-2xl mx-auto mb-16 w-full">
      <div className="space-y-2 md:space-y-4 flex flex-col items-center">
        <Heading
          level={1}
          className="text-2xl md:text-4xl! text-center"
          tracking="tight"
        >
          {survey?.title}
        </Heading>
        <p className="text-muted-fg text-center text-pretty text-base md:text-lg">
          {survey?.description}
        </p>
      </div>

      <Form
        className="w-full flex flex-col items-center gap-4 md:gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="w-full flex flex-col items-center gap-2">
          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, ...rest }, fieldState }) => (
              <TextField
                {...rest}
                onChange={(v) => {
                  onChange(v);
                  if (isDataAccessError(accessData)) {
                    reset();
                  }
                }}
                aria-label="Student Email"
                placeholder="Enter your email to start the survey"
                className={{
                  primitive: "w-full",
                  input: "text-base!",
                  fieldGroup: "h-16 bg-overlay w-full px-2",
                }}
                isInvalid={fieldState.invalid || isDataAccessError(accessData)}
              />
            )}
          />
          {error && (
            <Note intent="danger" className={{ container: "w-full" }}>
              {error}
            </Note>
          )}
          {accessData && isDataAccessError(accessData) && (
            <Note
              intent="danger"
              className={{
                container: "w-full",
                content: "text-sm md:text-base",
              }}
            >
              {accessData?.message}
            </Note>
          )}
        </div>

        <div className="flex flex-col items-center w-full">
          <Button
            intent="primary"
            size="lg"
            className="w-full md:w-52 h-13 md:h-14 px-6 text-xl! text-primary-fg mb-4 justify-between"
            type="submit"
            isPending={isPending}
          >
            Start Survey
            {isPending && (
              <ProgressCircle isIndeterminate aria-label="Loading..." />
            )}
            {!isPending && <HugeiconsIcon icon={ArrowRight02Icon} size={20} />}
          </Button>
          <span className="text-muted-fg text-xs hidden md:block">
            Press <span className="text-fg font-semibold mx-1">Enter ↵</span> or
            <span className="text-fg font-semibold mx-1">→</span>
            to start the survey
          </span>
        </div>
      </Form>
    </div>
  );
};
