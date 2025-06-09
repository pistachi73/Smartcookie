import type { ReadonlyURLSearchParams } from "next/navigation";
import { describe, expect, it } from "vitest";
import { validateSearchParams } from "../validate-search-params";

const createMockSearchParams = (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams(params);
  return {
    get: (key: string) => searchParams.get(key),
  } as unknown as ReadonlyURLSearchParams;
};

describe("validateSearchParams", () => {
  describe("Page Validation", () => {
    it("returns valid page number when provided", () => {
      const searchParams = createMockSearchParams({ page: "2" });
      const result = validateSearchParams(searchParams);

      expect(result.page).toBe(2);
    });

    it("defaults to page 1 when no page is provided", () => {
      const searchParams = createMockSearchParams();
      const result = validateSearchParams(searchParams);

      expect(result.page).toBe(1);
    });

    it("defaults to page 1 when page is invalid", () => {
      const searchParams = createMockSearchParams({ page: "invalid" });
      const result = validateSearchParams(searchParams);

      expect(result.page).toBe(1);
    });

    it("defaults to page 1 when page is zero", () => {
      const searchParams = createMockSearchParams({ page: "0" });
      const result = validateSearchParams(searchParams);

      expect(result.page).toBe(1);
    });

    it("defaults to page 1 when page is negative", () => {
      const searchParams = createMockSearchParams({ page: "-1" });
      const result = validateSearchParams(searchParams);

      expect(result.page).toBe(1);
    });

    it("defaults to page 1 when page is a float", () => {
      const searchParams = createMockSearchParams({ page: "2.5" });
      const result = validateSearchParams(searchParams);

      expect(result.page).toBe(1);
    });

    it("handles large page numbers correctly", () => {
      const searchParams = createMockSearchParams({ page: "999" });
      const result = validateSearchParams(searchParams);

      expect(result.page).toBe(999);
    });
  });

  describe("SortBy Validation", () => {
    it("returns valid sortBy when alphabetical is provided", () => {
      const searchParams = createMockSearchParams({ sortBy: "alphabetical" });
      const result = validateSearchParams(searchParams);

      expect(result.sortBy).toBe("alphabetical");
    });

    it("returns valid sortBy when newest is provided", () => {
      const searchParams = createMockSearchParams({ sortBy: "newest" });
      const result = validateSearchParams(searchParams);

      expect(result.sortBy).toBe("newest");
    });

    it("returns valid sortBy when response-count is provided", () => {
      const searchParams = createMockSearchParams({ sortBy: "response-count" });
      const result = validateSearchParams(searchParams);

      expect(result.sortBy).toBe("response-count");
    });

    it("defaults to alphabetical when no sortBy is provided", () => {
      const searchParams = createMockSearchParams();
      const result = validateSearchParams(searchParams);

      expect(result.sortBy).toBe("alphabetical");
    });

    it("defaults to alphabetical when sortBy is invalid", () => {
      const searchParams = createMockSearchParams({ sortBy: "invalid-sort" });
      const result = validateSearchParams(searchParams);

      expect(result.sortBy).toBe("alphabetical");
    });

    it("defaults to alphabetical when sortBy is empty", () => {
      const searchParams = createMockSearchParams({ sortBy: "" });
      const result = validateSearchParams(searchParams);

      expect(result.sortBy).toBe("alphabetical");
    });

    it("is case sensitive for sortBy values", () => {
      const searchParams = createMockSearchParams({ sortBy: "ALPHABETICAL" });
      const result = validateSearchParams(searchParams);

      expect(result.sortBy).toBe("alphabetical");
    });
  });

  describe("Query Validation", () => {
    it("returns query when provided", () => {
      const searchParams = createMockSearchParams({ q: "test search" });
      const result = validateSearchParams(searchParams);

      expect(result.q).toBe("test search");
    });

    it("returns empty string when no query is provided", () => {
      const searchParams = createMockSearchParams();
      const result = validateSearchParams(searchParams);

      expect(result.q).toBe("");
    });

    it("returns empty string when query is null", () => {
      const searchParams = createMockSearchParams({ q: "" });
      const result = validateSearchParams(searchParams);

      expect(result.q).toBe("");
    });

    it("preserves whitespace in query", () => {
      const searchParams = createMockSearchParams({ q: "  test  " });
      const result = validateSearchParams(searchParams);

      expect(result.q).toBe("  test  ");
    });

    it("handles special characters in query", () => {
      const searchParams = createMockSearchParams({ q: "test@#$%^&*()" });
      const result = validateSearchParams(searchParams);

      expect(result.q).toBe("test@#$%^&*()");
    });
  });

  describe("Combined Parameters", () => {
    it("validates all parameters together", () => {
      const searchParams = createMockSearchParams({
        page: "3",
        sortBy: "newest",
        q: "feedback",
      });
      const result = validateSearchParams(searchParams);

      expect(result).toEqual({
        page: 3,
        sortBy: "newest",
        q: "feedback",
      });
    });

    it("handles mixed valid and invalid parameters", () => {
      const searchParams = createMockSearchParams({
        page: "invalid",
        sortBy: "newest",
        q: "test",
      });
      const result = validateSearchParams(searchParams);

      expect(result).toEqual({
        page: 1,
        sortBy: "newest",
        q: "test",
      });
    });

    it("handles all invalid parameters", () => {
      const searchParams = createMockSearchParams({
        page: "invalid",
        sortBy: "invalid",
        q: "",
      });
      const result = validateSearchParams(searchParams);

      expect(result).toEqual({
        page: 1,
        sortBy: "alphabetical",
        q: "",
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles URLSearchParams object", () => {
      const urlSearchParams = new URLSearchParams(
        "page=2&sortBy=newest&q=test",
      );
      const result = validateSearchParams(
        urlSearchParams as unknown as ReadonlyURLSearchParams,
      );

      expect(result).toEqual({
        page: 2,
        sortBy: "newest",
        q: "test",
      });
    });
  });
});
