import type { ReadonlyURLSearchParams } from "next/navigation";

export interface ValidatedSearchParams {
  page: number;
  q: string;
}

/**
 * Validates and normalizes search parameters for feedback pages
 * @param searchParams - URLSearchParams or similar object with get method
 * @returns Validated search parameters with safe defaults
 */
export function validateStudentsSearchParams(
  searchParams: ReadonlyURLSearchParams,
): ValidatedSearchParams {
  // Validate page parameter
  const pageParam = searchParams.get("page");
  const page = Number(pageParam || "1");

  const validPage = Number.isInteger(page) && page > 0 ? page : 1;
  const q = searchParams.get("q") || "";

  return {
    page: validPage,
    q,
  };
}
