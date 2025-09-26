import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createMockSearchParams } from "@/shared/lib/testing/navigation-mocks";
import { cleanup, render, screen } from "@/shared/lib/testing/test-utils";

import { useRouter } from "@/i18n/navigation";
import { QuestionsPanel } from "../questions-panel";

// Create a mock router object
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock("../question-list-item", () => ({
  QuestionListItem: ({ question }: { question: any }) => (
    <div data-testid={`question-item-${question.id}`}>
      <h3>{question.title}</h3>
      <p>{question.description}</p>
    </div>
  ),
}));

vi.mock("../skeleton-question-list-item", () => ({
  SkeletonQuestionListItem: () => (
    <div data-testid="skeleton-question-item">Loading...</div>
  ),
}));

const mockQuestionsQueryOptions = vi.fn((params) => ({
  queryKey: [
    "feedback",
    "questions",
    {
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      sortBy: params?.sortBy || "alphabetical",
      q: params?.q || "",
    },
  ],
  queryFn: vi.fn(),
  placeholderData: vi.fn(),
}));

vi.mock("../../lib/questions-query-options", () => ({
  questionsQueryOptions: mockQuestionsQueryOptions,
}));

const mockValidateSearchParams = vi.fn(() => ({
  page: 1,
  sortBy: "alphabetical",
  q: "",
}));

vi.mock("../../lib/validate-search-params", () => ({
  validateSearchParams: mockValidateSearchParams,
}));

const mockQuestions = [
  {
    id: 1,
    title: "How would you rate our service?",
    description: "Please provide your honest feedback",
    type: "rating" as const,
    enableAdditionalComment: true,
  },
  {
    id: 2,
    title: "What improvements would you suggest?",
    description: "Help us improve our services",
    type: "text" as const,
    enableAdditionalComment: false,
  },
  {
    id: 3,
    title: "Would you recommend us?",
    description: null,
    type: "boolean" as const,
    enableAdditionalComment: true,
  },
];

const createMockQuestionsData = (questions: any[] = mockQuestions) => ({
  questions: questions.map((question, index) => ({
    ...question,
    createdAt: new Date(`2024-01-${String(index + 1).padStart(2, "0")}`),
    updatedAt: new Date(`2024-01-${String(index + 1).padStart(2, "0")}`),
  })),
  totalCount: questions.length,
  totalPages: Math.ceil(questions.length / 10),
});

const mockQuestionsData = createMockQuestionsData();

describe("QuestionsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearchParams).mockReturnValue(createMockSearchParams() as any);
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    mockValidateSearchParams.mockReturnValue({
      page: 1,
      sortBy: "alphabetical" as const,
      q: "",
    });
    // Reset the mock but keep the implementation
    mockQuestionsQueryOptions.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Loading States", () => {
    it("displays skeleton items when loading", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      // Should show 8 skeleton items
      const skeletonItems = screen.getAllByTestId("skeleton-question-item");
      expect(skeletonItems).toHaveLength(8);
      expect(skeletonItems[0]).toHaveTextContent("Loading...");
    });

    it("displays skeleton items when showing placeholder data", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockQuestionsData,
        isLoading: false,
        isPlaceholderData: true,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      const skeletonItems = screen.getAllByTestId("skeleton-question-item");
      expect(skeletonItems).toHaveLength(8);
    });
  });

  describe("Empty States", () => {
    it("displays no questions message when no data is returned", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { questions: [], totalCount: 0, totalPages: 1 },
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      expect(screen.getByText("No questions found")).toBeInTheDocument();
    });

    it("displays no questions message when data is undefined", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      expect(screen.getByText("No questions found")).toBeInTheDocument();
    });
  });

  describe("Questions Display", () => {
    it("renders questions when data is available", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockQuestionsData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      // Check that all questions are rendered
      expect(screen.getByTestId("question-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("question-item-2")).toBeInTheDocument();
      expect(screen.getByTestId("question-item-3")).toBeInTheDocument();

      // Check question content
      expect(
        screen.getByText("How would you rate our service?"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("What improvements would you suggest?"),
      ).toBeInTheDocument();
      expect(screen.getByText("Would you recommend us?")).toBeInTheDocument();
    });

    it("renders separators between questions", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockQuestionsData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      // Check for separators - each question has a separator, so 3 questions = 3 separators
      // Plus there might be additional separators in the SidebarPanel UI
      const separators = screen.getAllByRole("separator");
      expect(separators.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Query Integration", () => {
    it("renders with different search parameters", () => {
      mockValidateSearchParams.mockReturnValue({
        page: 2,
        sortBy: "newest" as const,
        q: "service",
      });

      vi.mocked(useQuery).mockReturnValue({
        data: mockQuestionsData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      // Verify that the component renders correctly with the data
      expect(
        screen.getByText("How would you rate our service?"),
      ).toBeInTheDocument();
      expect(screen.getByText("questions 1-3 of 3")).toBeInTheDocument();
    });

    it("renders with default parameters", () => {
      mockValidateSearchParams.mockReturnValue({
        page: 1,
        sortBy: "alphabetical" as const,
        q: "",
      });

      vi.mocked(useQuery).mockReturnValue({
        data: mockQuestionsData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      // Verify that the component renders correctly with the data
      expect(
        screen.getByText("How would you rate our service?"),
      ).toBeInTheDocument();
      expect(screen.getByText("questions 1-3 of 3")).toBeInTheDocument();
    });
  });

  describe("SidebarPanel Integration", () => {
    it("passes correct props to SidebarPanel", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockQuestionsData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      // Check that SidebarPanel receives correct panel type
      expect(screen.getByText("questions 1-3 of 3")).toBeInTheDocument();
    });

    it("passes loading state to SidebarPanel", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      // Should show skeleton items
      const skeletonItems = screen.getAllByTestId("skeleton-question-item");
      expect(skeletonItems).toHaveLength(8);
    });

    it("passes pagination data to SidebarPanel", () => {
      const paginatedData = {
        ...mockQuestionsData,
        totalCount: 25,
        totalPages: 3,
      };

      vi.mocked(useQuery).mockReturnValue({
        data: paginatedData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      expect(screen.getByText("questions 1-10 of 25")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles single question correctly", () => {
      const singleQuestionData = createMockQuestionsData([mockQuestions[0]!]);

      vi.mocked(useQuery).mockReturnValue({
        data: singleQuestionData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      expect(screen.getByTestId("question-item-1")).toBeInTheDocument();
      expect(screen.queryByTestId("question-item-2")).not.toBeInTheDocument();
      expect(screen.getByText("questions 1-1 of 1")).toBeInTheDocument();
    });

    it("handles questions without descriptions", () => {
      const questionsWithoutDescription = [
        { ...mockQuestions[0]!, description: null },
      ];
      const questionData = createMockQuestionsData(questionsWithoutDescription);

      vi.mocked(useQuery).mockReturnValue({
        data: questionData,
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      expect(screen.getByTestId("question-item-1")).toBeInTheDocument();
      expect(
        screen.getByText("How would you rate our service?"),
      ).toBeInTheDocument();
    });

    it("handles missing totalCount and totalPages gracefully", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { questions: mockQuestionsData.questions },
        isLoading: false,
        isPlaceholderData: false,
        isFetching: false,
      } as any);

      render(<QuestionsPanel />);

      // Should default to 0 totalCount and 1 totalPages
      expect(screen.getByText("No results")).toBeInTheDocument();
    });
  });
});
