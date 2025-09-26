import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePathname, useRouter } from "@/i18n/navigation";
import { SidebarPanel } from "../sidebar-panel";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("@/shared/hooks/use-navigate-with-params");

vi.mock("@/shared/hooks/use-debounced-value", () => ({
  useDebouncedValue: vi.fn(
    (value: string, _delay: number, callback: (value: string) => void) => {
      callback(value);
    },
  ),
}));

const createMockSearchParams = (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams(params);
  return {
    get: (key: string) => searchParams.get(key),
    has: (key: string) => searchParams.has(key),
    getAll: (key: string) => searchParams.getAll(key),
    keys: () => searchParams.keys(),
    values: () => searchParams.values(),
    entries: () => searchParams.entries(),
    forEach: (callback: (value: string, key: string) => void) =>
      searchParams.forEach(callback),
    toString: () => searchParams.toString(),
  };
};

describe("SidebarPanel", () => {
  const mockPush = vi.fn();
  const mockPathname = "/portal/feedback";

  const defaultProps = {
    children: <div data-testid="panel-content">Panel Content</div>,
    isLoading: false,
    totalItems: 25,
    totalPages: 3,
    panel: "questions" as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    vi.mocked(usePathname).mockReturnValue(mockPathname);
    vi.mocked(useSearchParams).mockReturnValue(createMockSearchParams() as any);
    cleanup();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders all basic UI elements", () => {
      render(<SidebarPanel {...defaultProps} />);

      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByTestId("panel-content")).toBeInTheDocument();
      expect(screen.getByText("Panel Content")).toBeInTheDocument();
      expect(screen.getByLabelText("pagination")).toBeInTheDocument();
    });
  });

  describe("Loading and Empty States", () => {
    it("displays loading state", () => {
      render(<SidebarPanel {...defaultProps} isLoading={true} />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("displays no results when totalItems is 0", () => {
      render(<SidebarPanel {...defaultProps} totalItems={0} totalPages={1} />);

      expect(screen.getByText("No results")).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("handles search input changes", () => {
      render(<SidebarPanel {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test query" } });

      expect(searchInput).toHaveValue("test query");
    });

    it("calls router.push when debounced search triggers", () => {
      render(<SidebarPanel {...defaultProps} />);
      const inputValue = "test search";
      const encodedInputValue = encodeURIComponent(inputValue);

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test search" } });

      vi.advanceTimersByTime(200);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(`q=${encodedInputValue}`),
      );
    });
  });

  describe("Item Count Display", () => {
    it("displays correct item count when not loading", () => {
      render(<SidebarPanel {...defaultProps} />);

      expect(screen.getByText("questions 1-10 of 25")).toBeInTheDocument();
    });

    it("displays correct item range for different pages", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        createMockSearchParams({ page: "2" }) as any,
      );

      render(<SidebarPanel {...defaultProps} />);

      expect(screen.getByText("questions 11-20 of 25")).toBeInTheDocument();
    });

    it("displays correct item range for last page with fewer items", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        createMockSearchParams({ page: "3" }) as any,
      );

      render(<SidebarPanel {...defaultProps} />);

      expect(screen.getByText("questions 21-25 of 25")).toBeInTheDocument();
    });

    it("works with surveys panel type", () => {
      render(<SidebarPanel {...defaultProps} panel="surveys" />);

      expect(screen.getByText("surveys 1-10 of 25")).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("shows current page in pagination", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        createMockSearchParams({ page: "2" }) as any,
      );

      render(<SidebarPanel {...defaultProps} />);

      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("shows total pages in pagination", () => {
      render(<SidebarPanel {...defaultProps} />);

      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("handles invalid page numbers by redirecting to page 1", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        createMockSearchParams({ page: "999" }) as any,
      );

      render(<SidebarPanel {...defaultProps} />);

      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("page=1"));
    });
  });

  describe("URL Parameters", () => {
    it("handles sort by parameter from URL", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        createMockSearchParams({ sortBy: "newest" }) as any,
      );

      render(<SidebarPanel {...defaultProps} />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});
