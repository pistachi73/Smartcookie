"use client";

import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { useNavigateWithParams } from "@/shared/hooks/use-navigate-with-params";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useCreateQuestion } from "../../hooks/questions/use-create-question";
import { QuestionFormSchema } from "../../lib/questions.schema";
import { QuestionForm } from "./question-form";

export const CreateQuestion = () => {
  const router = useRouter();
  const { createHrefWithParams } = useNavigateWithParams();

  const form = useForm<z.infer<typeof QuestionFormSchema>>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      enableAdditionalComment: false,
      questionType: "text",
    },
  });

  const backHref = createHrefWithParams("/portal/feedback");
  const { mutate, isPending } = useCreateQuestion({
    onSuccess: () => {
      router.push(backHref);
    },
  });

  const onSubmit = (data: z.infer<typeof QuestionFormSchema>) => {
    mutate(data);
  };

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
        <Heading level={2}>Create Question</Heading>
        <p className="text-muted-fg">
          Create a question to collect feedback from your users.
        </p>
      </div>

      <QuestionForm
        form={form}
        onSubmit={onSubmit}
        isPending={isPending}
        submitButtonText="Create Question"
        loadingText="Creating..."
      />
    </div>
  );
};
