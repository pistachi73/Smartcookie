import { useQueries } from "@tanstack/react-query";

import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/classes";

import { getUrlMetadataQueryOptions } from "@/features/quick-notes/hooks/use-url-metadata";
import { Link } from "../link";

interface LinkPreviewProps {
  title?: string;
  description?: string;
  url: string;
  className?: string;
  logo?: string;
}

/**
 * Component that displays a preview of a link with metadata
 */
export const LinkPreview = ({
  title,
  description,
  url,
  className,
  logo,
}: LinkPreviewProps) => {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group bg-muted/40 hover:bg-muted/50 block p-2  rounded-lg border border-gray-200",
        "transition-colors duration-200 group",
        className,
      )}
    >
      <div className="flex gap-2 items-center overflow-hidden">
        {logo && (
          <div className="shrink-0 size-5 rounded overflow-hidden relative flex items-center justify-center">
            {/** biome-ignore lint/performance/noImgElement: Super small images[] */}
            <img
              src={logo}
              alt={title || "Link preview"}
              className="object-cover"
            />
          </div>
        )}

        <p className="text-sm font-medium  text-info-text text-nowrap text-ellipsis">
          {title}
        </p>
        {description && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <p className="mt-1 text-xs text-muted-fg text-nowrap truncate">
              {description}
            </p>
          </>
        )}
      </div>
    </Link>
  );
};

export const PreviewLinks = ({
  urls,
  isViewOnlyMode,
  className,
}: {
  urls: string[];
  isViewOnlyMode: boolean;
  className?: string;
}) => {
  const metadataQueries = useQueries({
    queries: urls.map((url) => getUrlMetadataQueryOptions(url)),
  });
  return (
    metadataQueries.some((query) => query.data) &&
    !isViewOnlyMode && (
      <div className={cn(className)}>
        {metadataQueries.map(
          ({ data: urlMetadata }) =>
            urlMetadata?.title && (
              <LinkPreview
                key={urlMetadata.title}
                title={urlMetadata.title}
                description={urlMetadata.description}
                logo={urlMetadata.logo}
                url={urlMetadata.url}
              />
            ),
        )}
      </div>
    )
  );
};
