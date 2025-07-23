import { cn } from "@/shared/lib/classes";

import type { QuestionType } from "@/db/schema";
import { QuestionTypeBadge } from "../questions/question-type-badge";

type TemplateQuestionProps = {
  type: QuestionType;
  order: number;
  title: string;
  description?: string | null;
  required?: boolean;
  className?: string;
};

export const TemplateQuestion = ({
  type,
  order,
  title,
  description,
  required = false,
  className,
}: TemplateQuestionProps) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <QuestionTypeBadge type={type} label={`${order}`} />
      <div className="flex-1 space-y-0.5">
        <p className="font-medium text-pretty">
          {title}
          {required && <span className="text-danger">*</span>}
        </p>
        {description && <p className="text-xs text-muted-fg">{description}</p>}
      </div>
    </div>
  );
};
