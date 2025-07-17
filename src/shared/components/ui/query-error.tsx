import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Alert01Icon, RefreshIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

interface QueryErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export const QueryError = ({
  title = "Something went wrong",
  message = "We encountered an error while loading your data. Please try again.",
  onRetry,
  isRetrying = false,
  className,
}: QueryErrorProps) => {
  return (
    <Card className={` relative overflow-hidden  ${className}`}>
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-danger/20 rounded-full blur-xl animate-pulse" />
          <div className="relative p-4 bg-danger/10 rounded-full border border-danger/20">
            <HugeiconsIcon
              icon={Alert01Icon}
              size={28}
              className="text-danger"
            />
          </div>
        </div>
      </div>
      <Card.Header className="text-center">
        <Card.Title className="text-xl font-semibold text-foreground leading-tight">
          {title}
        </Card.Title>
        <Card.Description className="text-muted-fg text-base leading-relaxed">
          {message}
        </Card.Description>
      </Card.Header>
      <Card.Footer className="flex justify-center">
        <Button
          onPress={onRetry}
          isDisabled={isRetrying}
          intent="outline"
          className="transition-all duration-200"
        >
          {isRetrying ? (
            <>
              <HugeiconsIcon
                icon={RefreshIcon}
                size={16}
                className="animate-spin"
                data-slot="icon"
              />
              Retrying...
            </>
          ) : (
            <>
              <HugeiconsIcon icon={RefreshIcon} size={16} data-slot="icon" />
              Try again
            </>
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
};
