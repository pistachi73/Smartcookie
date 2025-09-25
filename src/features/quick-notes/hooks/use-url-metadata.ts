import { queryOptions } from "@tanstack/react-query";

interface UrlMetadata {
  siteName: string;
  title: string;
  description: string;
  logo: string;
  url: string;
}

export const getUrlMetadataQueryOptions = (url: string) => {
  return queryOptions({
    queryKey: ["url-metadata", url],
    queryFn: async () => {
      const response = await fetch(
        `/api/metadata?url=${encodeURIComponent(url)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch metadata");
      }

      const json = (await response.json()) as UrlMetadata;
      return json;
    },
  });
};
