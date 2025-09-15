import { useQueries } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";

import { useRouter } from "@/i18n/navigation";
import { QuestionDetails } from "../question-details";

vi.mock("@/shared/hooks/use-navigate-with-params");

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQueries: vi.fn(),
  };
});

vi.mock("../delete-question-modal", () => ({
  DeleteQuestionModal: ({ isOpen, question }: any) =>
    isOpen ? (
      <div data-testid="delete-modal">Delete modal for {question.title}</div>
    ) : null,
}));

vi.mock("../question-type-badge", () => ({
  QuestionTypeBadge: ({ type, label }: { type: string; label?: boolean }) => (
    <span data-testid="question-type-badge">
      {label ? `${type} question` : type}
    </span>
  ),
}));

vi.mock("../../shared/feedback-loading", () => ({
  FeedbackLoading: ({ title }: { title: string }) => (
    <div data-testid="feedback-loading">{title}</div>
  ),
}));

vi.mock("../../shared/feedback-not-found", () => ({
  FeedbackNotFound: ({ title, description }: any) => (
    <div data-testid="feedback-not-found">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  ),
}));

// Don't mock the answer components - test them as part of integration

const mockQuestion = {
  id: 1,
  title: "How would you rate our service?",
  description: "Please provide your honest feedback",
  type: "rating" as const,
  totalAnswers: 5,
  enableAdditionalComment: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRatingAnswers = [
  { id: 1, value: "5", additionalComment: null },
  { id: 2, value: "4", additionalComment: "Good service" },
  { id: 3, value: "5", additionalComment: null },
  { id: 4, value: "3", additionalComment: "Could be better" },
  { id: 5, value: "5", additionalComment: null },
];

const mockBooleanAnswers = [
  { id: 1, value: "true", additionalComment: null },
  { id: 2, value: "false", additionalComment: "Not satisfied" },
  { id: 3, value: "true", additionalComment: null },
  { id: 4, value: "true", additionalComment: "Very happy" },
];

const mockTextAnswers = [
  { id: 1, value: "Great service overall", additionalComment: null },
  { id: 2, value: "Could improve response time", additionalComment: null },
  { id: 3, value: "Excellent support team", additionalComment: null },
];

const waitForQuestionDetailsRendered = async (hasResponse: boolean) => {
  if (hasResponse) {
    await screen.findByText("Total Responses");
  } else {
    await screen.findByText("No responses found");
  }
};

describe("QuestionDetails", () => {
  const mockPush = vi.fn();
  const questionId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  describe("Loading States", () => {
    it("renders loading state when question is loading", () => {
      vi.mocked(useQueries).mockReturnValue([
        { data: undefined, isLoading: true },
        { data: undefined, isPending: false },
      ] as any);

      render(<QuestionDetails questionId={questionId} />);

      expect(screen.getByTestId("feedback-loading")).toBeInTheDocument();
      expect(screen.getByText("Loading question...")).toBeInTheDocument();
    });

    it("renders loading state for answers when answers are loading", () => {
      vi.mocked(useQueries).mockReturnValue([
        { data: mockQuestion, isLoading: false },
        { data: undefined, isPending: true },
      ] as any);

      render(<QuestionDetails questionId={questionId} />);

      expect(screen.getByTestId("feedback-loading")).toBeInTheDocument();
      expect(screen.getByText("Loading answers...")).toBeInTheDocument();
    });
  });

  describe("Not Found State", () => {
    it("renders not found state when question doesn't exist", () => {
      vi.mocked(useQueries).mockReturnValue([
        { data: null, isLoading: false },
        { data: undefined, isPending: false },
      ] as any);

      render(<QuestionDetails questionId={questionId} />);

      expect(screen.getByTestId("feedback-not-found")).toBeInTheDocument();
      expect(screen.getByText("Question not found")).toBeInTheDocument();
      expect(
        screen.getByText("This question seems to have vanished into thin air!"),
      ).toBeInTheDocument();
    });
  });

  describe("Question Display", () => {
    beforeEach(() => {
      vi.mocked(useQueries).mockReturnValue([
        { data: mockQuestion, isLoading: false },
        { data: mockRatingAnswers, isPending: false },
      ] as any);
    });

    it("renders question details correctly", () => {
      render(<QuestionDetails questionId={questionId} />);

      expect(
        screen.getByText("How would you rate our service?"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Please provide your honest feedback"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("question-type-badge")).toBeInTheDocument();
      expect(screen.getByText("5 responses")).toBeInTheDocument();
    });

    it("renders question without description", () => {
      const questionWithoutDescription = {
        ...mockQuestion,
        description: null,
      };

      vi.mocked(useQueries).mockReturnValue([
        { data: questionWithoutDescription, isLoading: false },
        { data: mockRatingAnswers, isPending: false },
      ] as any);

      render(<QuestionDetails questionId={questionId} />);

      expect(
        screen.getByText("How would you rate our service?"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Please provide your honest feedback"),
      ).not.toBeInTheDocument();
    });

    it("handles singular response count", () => {
      const questionWithOneResponse = {
        ...mockQuestion,
        totalAnswers: 1,
      };

      vi.mocked(useQueries).mockReturnValue([
        { data: questionWithOneResponse, isLoading: false },
        { data: [mockRatingAnswers[0]], isPending: false },
      ] as any);

      render(<QuestionDetails questionId={questionId} />);

      // Use getAllByText to handle multiple elements with same text
      const responseElements = screen.getAllByText("1 response");
      expect(responseElements.length).toBeGreaterThan(0);
    });
  });

  describe("Navigation", () => {
    beforeEach(() => {
      vi.mocked(useQueries).mockReturnValue([
        { data: mockQuestion, isLoading: false },
        { data: mockRatingAnswers, isPending: false },
      ] as any);
    });

    it("renders back to hall link", () => {
      render(<QuestionDetails questionId={questionId} />);

      const backLink = screen.getByRole("link", { name: /back to hall/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/portal/feedback");
    });
  });

  describe("Actions Menu", () => {
    beforeEach(() => {
      vi.mocked(useQueries).mockReturnValue([
        { data: mockQuestion, isLoading: false },
        { data: mockRatingAnswers, isPending: false },
      ] as any);
    });

    it("navigates to edit page when edit is clicked", async () => {
      render(<QuestionDetails questionId={questionId} />);

      const menuButton = await screen.findByTestId(
        "question-details-menu-trigger",
      );
      fireEvent.click(menuButton);

      const editMenuItem = screen.getByText("Edit");
      fireEvent.click(editMenuItem);

      expect(mockPush).toHaveBeenCalledWith(
        `/portal/feedback/questions/${questionId}/edit`,
      );
    });

    it("opens delete modal when delete is clicked", async () => {
      render(<QuestionDetails questionId={questionId} />);

      const menuButton = await screen.findByTestId(
        "question-details-menu-trigger",
      );

      fireEvent.click(menuButton);

      const deleteMenuItem = await screen.findByText("Delete");
      fireEvent.click(deleteMenuItem);

      await waitFor(async () => {
        expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
        expect(
          screen.getByText("Delete modal for How would you rate our service?"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Answer Type Rendering", () => {
    it("renders rating answers for rating questions", async () => {
      vi.mocked(useQueries).mockReturnValue([
        { data: { ...mockQuestion, type: "rating" }, isLoading: false },
        { data: mockRatingAnswers, isPending: false },
      ] as any);

      render(<QuestionDetails questionId={questionId} />);
      await waitForQuestionDetailsRendered(true);

      // Check for rating-specific elements
      expect(screen.getByText("5 responses")).toBeInTheDocument();
      expect(screen.getByText("Average")).toBeInTheDocument();
      expect(screen.getByText("4.4")).toBeInTheDocument(); // Average of [5,4,5,3,5] = 4.4
      expect(screen.getByText("/10")).toBeInTheDocument();

      // Check for rating distribution bars - look for individual parts
      expect(screen.getByText("3 responses")).toBeInTheDocument(); // Count for rating 5
      expect(screen.getByText("(60%)")).toBeInTheDocument(); // Percentage for rating 5
      expect(screen.getAllByText("1 response")).toHaveLength(2); // Ratings 4 and 3 each have 1 response
      expect(screen.getAllByText("(20%)")).toHaveLength(2); // Ratings 4 and 3 each have 20%
    });

    it("renders boolean answers for boolean questions", async () => {
      vi.mocked(useQueries).mockReturnValue([
        { data: { ...mockQuestion, type: "boolean" }, isLoading: false },
        { data: mockBooleanAnswers, isPending: false },
      ] as any);

      render(<QuestionDetails questionId={questionId} />);
      await waitForQuestionDetailsRendered(true);

      // Check for boolean-specific elements - use Total Responses instead of just responses
      expect(screen.getByText("Total Responses")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument(); // Total count in the data card
      expect(screen.getByText("Majority")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument(); // 3 true vs 1 false
      expect(screen.getByText("POSITIVE")).toBeInTheDocument();
      expect(screen.getByText("NEGATIVE")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument(); // Count for positive
      expect(screen.getByText("1")).toBeInTheDocument(); // Count for negative
      expect(screen.getByText("75")).toBeInTheDocument(); // Percentage without %
      expect(screen.getByText("25")).toBeInTheDocument(); // Percentage without %
    });

    it("renders text answers for text questions", async () => {
      vi.mocked(useQueries).mockReturnValue([
        {
          data: { ...mockQuestion, type: "text", totalAnswers: 3 },
          isLoading: false,
        },
        { data: mockTextAnswers, isPending: false },
      ] as any);

      render(<QuestionDetails questionId={questionId} />);
      await waitForQuestionDetailsRendered(true);

      // Check for text answer content
      expect(screen.getByText("Great service overall")).toBeInTheDocument();
      expect(
        screen.getByText("Could improve response time"),
      ).toBeInTheDocument();
      expect(screen.getByText("Excellent support team")).toBeInTheDocument();

      // Check for text-specific elements
      expect(screen.getByText("3 responses")).toBeInTheDocument();
      expect(screen.getByText("Average Length")).toBeInTheDocument();
      expect(screen.getByText("chars")).toBeInTheDocument();
      expect(screen.getByText("Responses")).toBeInTheDocument();

      // Check character counts are displayed
      expect(screen.getByText("21 chars")).toBeInTheDocument(); // "Great service overall"
      expect(screen.getByText("27 chars")).toBeInTheDocument(); // "Could improve response time"
      expect(screen.getByText("22 chars")).toBeInTheDocument(); // "Excellent support team"
    });

    it("handles empty answers array", () => {
      vi.mocked(useQueries).mockReturnValue([
        { data: { ...mockQuestion, totalAnswers: 0 }, isLoading: false },
        { data: [], isPending: false },
      ] as any);

      render(<QuestionDetails questionId={questionId} />);

      // Should show no answers message for rating type
      expect(screen.getByText("0 responses")).toBeInTheDocument();
      expect(screen.getByText("No responses found")).toBeInTheDocument();
      expect(
        screen.getByText("Waiting for rating responses!"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Try adjusting the date filter to see more responses"),
      ).toBeInTheDocument();
    });

    it("handles null answers", () => {
      vi.mocked(useQueries).mockReturnValue([
        { data: { ...mockQuestion, totalAnswers: 0 }, isLoading: false },
        { data: null, isPending: false },
      ] as any);

      render(<QuestionDetails questionId={questionId} />);

      // Should show no answers message for rating type
      expect(screen.getByText("0 responses")).toBeInTheDocument();
      expect(screen.getByText("No responses found")).toBeInTheDocument();
      expect(
        screen.getByText("Waiting for rating responses!"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Try adjusting the date filter to see more responses"),
      ).toBeInTheDocument();
    });
  });

  describe("Filters", () => {
    beforeEach(() => {
      vi.mocked(useQueries).mockReturnValue([
        { data: mockQuestion, isLoading: false },
        { data: mockRatingAnswers, isPending: false },
      ] as any);
    });

    it("renders filters button", () => {
      render(<QuestionDetails questionId={questionId} />);

      expect(
        screen.getByRole("button", { name: /filters/i }),
      ).toBeInTheDocument();
    });

    it("toggles filters section when filters button is clicked", () => {
      render(<QuestionDetails questionId={questionId} />);

      const filtersButton = screen.getByRole("button", { name: /filters/i });

      // Initially filters should be closed
      expect(screen.queryByText("Date Range")).not.toBeInTheDocument();

      // Click to open filters
      fireEvent.click(filtersButton);

      expect(screen.getByText("Date Range")).toBeInTheDocument();
      expect(screen.getByText("(max 6 months)")).toBeInTheDocument();
    });

    it("shows date range indicator with current date range", () => {
      render(<QuestionDetails questionId={questionId} />);

      expect(screen.getByText(/showing responses from/i)).toBeInTheDocument();

      // Should show current month dates (since getInitialDateRange sets last 30 days)
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleDateString("en-US", {
        month: "short",
      });
      expect(screen.getByText(new RegExp(currentMonth))).toBeInTheDocument();
    });

    it("shows apply filters button when filters are open", () => {
      render(<QuestionDetails questionId={questionId} />);

      const filtersButton = screen.getByRole("button", { name: /filters/i });
      fireEvent.click(filtersButton);

      expect(
        screen.getByRole("button", { name: /apply filters/i }),
      ).toBeInTheDocument();
    });

    it("disables apply filters button when no changes are made", () => {
      render(<QuestionDetails questionId={questionId} />);

      const filtersButton = screen.getByRole("button", { name: /filters/i });
      fireEvent.click(filtersButton);

      const applyButton = screen.getByRole("button", {
        name: /apply filters/i,
      });
      expect(applyButton).toBeDisabled();
    });

    it("shows date range picker when filters are open", async () => {
      render(<QuestionDetails questionId={questionId} />);

      const filtersButton = screen.getByRole("button", { name: /filters/i });
      fireEvent.click(filtersButton);

      // Check for date range picker elements - look for the group element
      expect(await screen.findByRole("group")).toBeInTheDocument();
      // Check for spinbutton elements (date inputs)
      expect(screen.getAllByRole("spinbutton")).toHaveLength(6); // month, day, year for start and end dates
    });

    it("updates date range indicator when filters are applied", () => {
      render(<QuestionDetails questionId={questionId} />);

      // The date range indicator should always be visible showing the current applied range
      const dateRangeText = screen.getByText(/showing responses from/i);
      expect(dateRangeText).toBeInTheDocument();

      // Should contain formatted dates
      expect(dateRangeText.textContent).toMatch(/\w{3} \d{1,2}, \d{4}/); // Format: "Jan 1, 2024"
    });
  });

  describe("Query Integration", () => {
    it("calls useQueries with correct parameters", () => {
      render(<QuestionDetails questionId={questionId} />);

      expect(useQueries).toHaveBeenCalledWith({
        queries: expect.arrayContaining([
          expect.objectContaining({
            queryKey: ["question", questionId],
          }),
          expect.objectContaining({
            queryKey: expect.arrayContaining([
              "question",
              questionId,
              "answers",
            ]),
          }),
        ]),
      });
    });
  });
});
