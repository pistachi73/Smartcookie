import { Heading } from "@/shared/components/ui/heading";
import { Modal } from "@/shared/components/ui/modal";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "react-aria-components";
import { useCreateSurvey } from "../../hooks/feedback/use-create-survey";
import { useSurveyTemplates } from "../../hooks/feedback/use-survey-templates";

type NewSurveyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hubId: number;
};

export const CreateHubSurveyModal = ({
  open,
  onOpenChange,
  hubId,
}: NewSurveyModalProps) => {
  const { data: surveyTemplates, isPending } = useSurveyTemplates();
  const { mutate: createSurvey } = useCreateSurvey({
    hubId,
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  return (
    <Modal.Content isOpen={open} onOpenChange={onOpenChange} size="3xl">
      <Modal.Header
        title="Create new survey"
        description="Select a survey template to create a new feedback survey for this course."
      />
      <Modal.Footer className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {isPending
          ? Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-30 w-full" soft={false} />
            ))
          : surveyTemplates?.map((template) => (
              <Button
                key={`survey-template-${template.id}`}
                className="p-4 rounded-lg bg-bg border text-left w-full hover:border-primary hover:bg-primary-tint transition-colors cursor-pointer"
                onPress={() =>
                  createSurvey({
                    hubId,
                    surveyTemplateId: template.id,
                  })
                }
              >
                <Heading level={4} className="line-clamp-1">
                  {template.title}
                </Heading>
                <p className="text-muted-fg text-sm line-clamp-2">
                  {template.description}
                </p>
              </Button>
            ))}
      </Modal.Footer>
    </Modal.Content>
  );
};
