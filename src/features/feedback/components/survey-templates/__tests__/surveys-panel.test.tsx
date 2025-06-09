import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createMockSearchParams,
  mockNextNavigation,
} from "@/shared/lib/testing/navigation-mocks";
import { cleanup, render, screen } from "@/shared/lib/testing/test-utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { SurveysPanel } from "../surveys-panel";

mockNextNavigation();

const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock("@/shared/hooks/use-navigate-with-params");
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock("../survey-list-item", () => ({
  SurveyListItem: ({ survey }: { survey: any }) => (
    <div data-testid={`survey-item-${survey.id}`}>
      <h3>{survey.title}</h3>
      <p>{survey.description}</p>
      <span>{survey.totalResponses} responses</span>
    </div>
  ),
}));

vi.mock("../../questions/skeleton-question-list-item", () => ({
  SkeletonQuestionListItem: () => {
    return <div data-testid="skeleton-survey-item">Loading...</div>;
  },
}));

const mockSurveys = [
  {
    id: 1,
    title: "Customer Satisfaction Survey",
    description: "Help us improve our services",
    totalResponses: 42,
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Product Feedback Survey",
    description: "Tell us about your experience",
    totalResponses: 15,
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    title: "Employee Satisfaction",
    description: null,
    totalResponses: 8,
    updatedAt: "2024-01-03T00:00:00Z",
  },
];

const createMockSurveysData = (surveys: any[] = mockSurveys) => ({
  surveys,
  totalCount: surveys.length,
  totalPages: Math.ceil(surveys.length / 10),
  page: 1,
  pageSize: 10,
});

const mockSurveysData = createMockSurveysData();

describe("SurveysPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearchParams).mockReturnValue(createMockSearchParams() as any);
    vi.mocked(useRouter).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    cleanup();
  });

  describe("Loading States", () => {
    it("displays skeleton items when loading", () => {
      const mockQueryResult = {
        data: undefined,
        isLoading: true,
        isPlaceholderData: false,
        isFetching: false,
      } as any;

      vi.mocked(useQuery).mockReturnValue(mockQueryResult);

      render(<SurveysPanel />);

      const skeletonItems = screen.getAllByTestId("skeleton-survey-item");
      expect(skeletonItems).toHaveLength(8);
      expect(skeletonItems[0]).toHaveTextContent("Loading...");
    });

    it("displays skeleton items when showing placeholder data", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockSurveysData,
        isLoading: false,
        isPlaceholderData: true,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      const skeletonItems = screen.getAllByTestId("skeleton-survey-item");
      expect(skeletonItems).toHaveLength(8);
    });
  });

  describe("Empty States", () => {
    it("displays no surveys message when no data is returned", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { surveys: [], totalCount: 0, totalPages: 1 },
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      expect(screen.getByText("No surveys found")).toBeInTheDocument();
    });

    it("displays no surveys message when data is undefined", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      expect(screen.getByText("No surveys found")).toBeInTheDocument();
    });
  });

  describe("Surveys Display", () => {
    it("renders surveys when data is available", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockSurveysData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      expect(screen.getByTestId("survey-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("survey-item-2")).toBeInTheDocument();
      expect(screen.getByTestId("survey-item-3")).toBeInTheDocument();

      expect(
        screen.getByText("Customer Satisfaction Survey"),
      ).toBeInTheDocument();
      expect(screen.getByText("Product Feedback Survey")).toBeInTheDocument();
      expect(screen.getByText("Employee Satisfaction")).toBeInTheDocument();
    });

    it("renders survey response counts", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockSurveysData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      expect(screen.getByText("42 responses")).toBeInTheDocument();
      expect(screen.getByText("15 responses")).toBeInTheDocument();
      expect(screen.getByText("8 responses")).toBeInTheDocument();
    });
  });

  describe("Query Integration", () => {
    it("calls useQuery with correct parameters from URL", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        createMockSearchParams({
          page: "2",
          sortBy: "newest",
          q: "customer",
        }) as any,
      );

      vi.mocked(useQuery).mockReturnValue({
        data: mockSurveysData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["feedback", "surveys", 2, 10, "newest", "customer"],
        }),
      );
    });
  });

  describe("SidebarPanel Integration", () => {
    it("passes correct props to SidebarPanel", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockSurveysData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      expect(screen.getByText("surveys 1-3 of 3")).toBeInTheDocument();
    });

    it("passes loading state to SidebarPanel", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      const loadingTexts = screen.getAllByText("Loading...");
      expect(loadingTexts.length).toBeGreaterThan(0);
    });

    it("passes pagination data to SidebarPanel", () => {
      const paginatedData = {
        ...mockSurveysData,
        totalCount: 25,
        totalPages: 3,
      };

      vi.mocked(useQuery).mockReturnValue({
        data: paginatedData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      expect(screen.getByText("surveys 1-10 of 25")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty surveys array", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: createMockSurveysData([]),
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      expect(screen.getByText("No surveys found")).toBeInTheDocument();
    });

    it("handles single survey correctly", () => {
      const singleSurveyData = createMockSurveysData([mockSurveys[0]]);

      vi.mocked(useQuery).mockReturnValue({
        data: singleSurveyData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      expect(screen.getByTestId("survey-item-1")).toBeInTheDocument();
      expect(screen.queryByTestId("survey-item-2")).not.toBeInTheDocument();
      expect(screen.getByText("surveys 1-1 of 1")).toBeInTheDocument();
    });

    it("handles surveys with null descriptions", () => {
      const surveysWithNullDescription = [
        {
          id: 1,
          title: "Survey without description",
          description: null,
          totalResponses: 5,
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      vi.mocked(useQuery).mockReturnValue({
        data: createMockSurveysData(surveysWithNullDescription),
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      expect(
        screen.getByText("Survey without description"),
      ).toBeInTheDocument();
      expect(screen.getByText("5 responses")).toBeInTheDocument();
    });

    it("handles missing totalCount and totalPages gracefully", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { surveys: mockSurveysData.surveys },
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<SurveysPanel />);

      expect(screen.getByText("No results")).toBeInTheDocument();
    });
  });
});
