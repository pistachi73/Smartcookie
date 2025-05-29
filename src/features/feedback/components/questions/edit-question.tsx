"use client";

import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { useNavigateWithParams } from "@/shared/hooks/use-navigate-with-params";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useQuestion } from "../../hooks/use-question";
import { useUpdateQuestion } from "../../hooks/use-update-question";
import {
  QuestionFormSchema,
  type UpdateQuestionFormSchema,
} from "../../lib/questions.schema";
import { QuestionForm } from "./question-form";
import { QuestionLoading } from "./question-loading";
import { QuestionNotFound } from "./question-not-found";

interface EditQuestionProps {
  questionId: number;
}

export const EditQuestion = ({ questionId }: EditQuestionProps) => {
  const router = useRouter();
  const { createHrefWithParams } = useNavigateWithParams();

  const questionQuery = useQuestion(questionId);
  const question = questionQuery.data;

  console.log(question);

  const form = useForm<z.infer<typeof QuestionFormSchema>>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      enableAdditionalComment: false,
      questionType: "text",
    },
  });

  // Update form when question data loads
  useEffect(() => {
    if (question) {
      form.reset({
        title: question.title,
        description: question.description || "",
        enableAdditionalComment: question.enableAdditionalComment,
        questionType: question.type,
      });
    }
  }, [question, form]);

  const backHref = createHrefWithParams("/portal/feedback");
  const questionHref = createHrefWithParams(
    `/portal/feedback/questions/${questionId}`,
  );
  const { mutate, isPending } = useUpdateQuestion({
    onSuccess: () => {
      router.push(questionHref);
    },
  });

  const onSubmit = (data: z.infer<typeof QuestionFormSchema>) => {
    const updateData: z.infer<typeof UpdateQuestionFormSchema> = {
      id: questionId,
      ...data,
    };
    mutate(updateData);
  };

  if (questionQuery.isLoading) {
    return <QuestionLoading />;
  }

  if (!question) {
    return <QuestionNotFound />;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <Link
        intent="secondary"
        href={backHref}
        className="flex items-center gap-1.5 text-sm"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} data-slot="icon" />
        Back
      </Link>

      <div className="space-y-1">
        <Heading level={2}>Edit Question</Heading>
        <p className="text-sm text-muted-fg">
          Update your question details. Note that the question type cannot be
          changed.
        </p>
      </div>

      <QuestionForm
        form={form}
        onSubmit={onSubmit}
        isPending={isPending}
        submitButtonText="Update Question"
        loadingText="Updating..."
        disabledFields={{ questionType: true }}
      />
    </div>
  );
};
