import { Heading } from "@/shared/components/ui/heading";

export const SurveyNotFound = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-bg text-center px-4">
      <div className="flex flex-col items-center gap-4 p-8 border bg-overlay rounded-2xl shdow-md">
        <span className="text-6xl text-muted-fg">😢</span>
        <Heading level={1}>Survey Not Found</Heading>
        <div className="space-y-1">
          <p className="text-muted-fg text-base text-pretty">
            The survey you are looking for does not exist or is no longer
            available.
          </p>
          <p className="text-muted-fg text-base text-pretty">
            Please check the link or contact your teacher for help.
          </p>
        </div>
      </div>
    </div>
  );
};
