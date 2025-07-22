import type { ReadonlyURLSearchParams } from "next/navigation";

import type { SortBy } from "@/data-access/questions/schemas";

export interface ValidatedSearchParams {
  page: number;
  sortBy: SortBy;
  q: string;
}

/**
 * Validates and normalizes search parameters for feedback pages
 * @param searchParams - URLSearchParams or similar object with get method
 * @returns Validated search parameters with safe defaults
 */
export function validateSearchParams(
  searchParams: ReadonlyURLSearchParams,
): ValidatedSearchParams {
  // Validate page parameter
  const pageParam = searchParams.get("page");
  const page = Number(pageParam || "1");
  const sortByParam = searchParams.get("sortBy");

  const validPage = Number.isInteger(page) && page > 0 ? page : 1;
  // Validate sortBy parameter
  const validSortBy: SortBy =
    sortByParam === "alphabetical" ||
    sortByParam === "newest" ||
    sortByParam === "response-count"
      ? sortByParam
      : "alphabetical";

  // Validate query parameter
  const q = searchParams.get("q") || "";

  return {
    page: validPage,
    sortBy: validSortBy,
    q,
  };
}
