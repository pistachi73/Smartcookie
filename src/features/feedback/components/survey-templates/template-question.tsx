import type { QuestionType } from "@/db/schema";
import { cn } from "@/shared/lib/classes";
import { QuestionTypeBadge } from "../questions/question-type-badge";

type TemplateQuestionProps = {
  id: number;
  type: QuestionType;
  order: number;
  title: string;
  description?: string | null;
  required?: boolean;
  className?: string;
};

export const TemplateQuestion = ({
  id,
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
