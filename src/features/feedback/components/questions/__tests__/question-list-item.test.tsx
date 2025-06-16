import type { SurveyTemplateFormState } from "@/features/feedback/types/survey-template-form-store.types";
import { mockNextNavigation } from "@/shared/lib/testing/navigation-mocks";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";
import { useParams, usePathname, useRouter } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSurveyTemplateFormStore } from "../../../store/survey-template-form.store";
import { type FeedbackQuestion, QuestionListItem } from "../question-list-item";
mockNextNavigation();

vi.mock("../../../store/survey-template-form.store", () => ({
  useSurveyTemplateFormStore: vi.fn(),
}));

vi.mock("@/shared/hooks/use-navigate-with-params");

const mockSurveyTemplateFormStore =
  mockZustandStoreImplementation<SurveyTemplateFormState>({
    hook: useSurveyTemplateFormStore,
    initialState: {
      currentStep: 1,
      questions: [],
    },
  });

vi.mock("../delete-question-modal", () => ({
  DeleteQuestionModal: ({ isOpen, question }: any) =>
    isOpen ? (
      <div data-testid="delete-modal">Delete {question.title}</div>
    ) : null,
}));

vi.mock("../question-type-badge", () => ({
  QuestionTypeBadge: ({ type }: { type: string }) => (
    <span data-testid="question-type-badge">{type}</span>
  ),
}));

describe("QuestionListItem", () => {
  const mockPush = vi.fn();
  const mockQuestion: FeedbackQuestion = {
    id: 1,
    title: "How would you rate our service?",
    type: "rating",
    description: "Please rate from 1-10",
    answerCount: 5,
    enableAdditionalComment: true,
    updatedAt: new Date().toISOString(),
  };
  const mockQuestion2: FeedbackQuestion = {
    ...mockQuestion,
    id: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    vi.mocked(useParams).mockReturnValue({ questionId: "1" });
    vi.mocked(usePathname).mockReturnValue("/portal/feedback/questions");
    mockSurveyTemplateFormStore.resetState();
  });
  afterEach(() => {
    cleanup();
  });

  describe("Non-draggable mode (default)", () => {
    it("renders question information", () => {
      render(<QuestionListItem question={mockQuestion} />);

      expect(
        screen.getByText("How would you rate our service?"),
      ).toBeInTheDocument();
      expect(screen.getByText("5 responses")).toBeInTheDocument();
      expect(screen.getByTestId("question-type-badge")).toHaveTextContent(
        "rating",
      );
    });

    it("highlights active question", () => {
      vi.mocked(useParams).mockReturnValue({ questionId: "1" });
      render(<QuestionListItem question={mockQuestion} />);
      const container = screen.getByTestId("question-list-item");
      expect(container).toHaveAttribute("data-selected", "true");
    });

    it("does not highlight inactive question", () => {
      vi.mocked(useParams).mockReturnValue({ questionId: "2" });
      render(<QuestionListItem question={mockQuestion} />);

      const container = screen.getByTestId("question-list-item");
      expect(container).toHaveAttribute("data-selected", "false");
    });

    it("shows menu button and options", () => {
      render(<QuestionListItem question={mockQuestion} />);

      const menuButton = screen.getByRole("button");
      fireEvent.click(menuButton);

      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("navigates to edit page when edit is clicked", () => {
      render(<QuestionListItem question={mockQuestion} />);

      const menuButton = screen.getByRole("button");
      fireEvent.click(menuButton);

      const editButton = screen.getByText("Edit");
      fireEvent.click(editButton);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("/portal/feedback/questions/1/edit"),
      );
    });

    it("opens delete modal when delete is clicked", () => {
      render(<QuestionListItem question={mockQuestion} />);

      const menuButton = screen.getByRole("button");
      fireEvent.click(menuButton);

      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);

      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
      expect(
        screen.getByText("Delete How would you rate our service?"),
      ).toBeInTheDocument();
    });

    it("creates correct navigation links", () => {
      render(<QuestionListItem question={mockQuestion} />);

      const questionLink = screen.getByRole("link");
      expect(questionLink).toHaveAttribute(
        "href",
        expect.stringContaining("/portal/feedback/questions/1"),
      );
    });
  });

  describe("Draggable mode (in survey form)", () => {
    const mockAddQuestions = vi.fn();
    const mockRemoveQuestion = vi.fn();
    beforeEach(() => {
      vi.mocked(usePathname).mockReturnValue(
        "/portal/feedback/survey-templates/new",
      );
      mockSurveyTemplateFormStore.setState({
        currentStep: 2,
        addQuestion: mockAddQuestions,
        removeQuestion: mockRemoveQuestion,
      });
    });

    it("renders draggable question item in survey form", () => {
      render(<QuestionListItem question={mockQuestion} />);

      expect(
        screen.getByText("How would you rate our service?"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("question-type-badge")).toBeInTheDocument();
    });

    it("shows drag handle in survey form", () => {
      render(<QuestionListItem question={mockQuestion} />);

      const dragHandle = screen.getByTestId("drag-handle");
      expect(dragHandle).toBeInTheDocument();
    });

    it("detects new survey form path", () => {
      vi.mocked(usePathname).mockReturnValue(
        "/portal/feedback/survey-templates/new",
      );
      mockSurveyTemplateFormStore.setState({
        currentStep: 2,
      });

      render(<QuestionListItem question={mockQuestion} />);

      expect(screen.getByTestId("drag-handle")).toBeInTheDocument();
    });

    it("detects edit survey form path", () => {
      vi.mocked(usePathname).mockReturnValue(
        "/portal/feedback/survey-templates/123/edit",
      );
      mockSurveyTemplateFormStore.setState({
        currentStep: 2,
      });

      render(<QuestionListItem question={mockQuestion} />);

      expect(screen.getByTestId("drag-handle")).toBeInTheDocument();
    });

    it("shows selected index if question is in the form", () => {
      vi.mocked(usePathname).mockReturnValue(
        "/portal/feedback/survey-templates/123/edit",
      );

      mockSurveyTemplateFormStore.setState({
        currentStep: 2,
        questions: [
          {
            ...mockQuestion,
            order: 1,
            required: false,
          },
          {
            ...mockQuestion2,
            order: 2,
            required: false,
          },
        ],
      });
      render(<QuestionListItem question={mockQuestion2} />);

      expect(screen.getByTestId("drag-handle")).toBeInTheDocument();
      expect(screen.getByTestId("add-question-button")).toHaveTextContent("2");
    });

    it("adds question to form when add button is clicked", () => {
      render(<QuestionListItem question={mockQuestion} />);

      const addButton = screen.getByTestId("add-question-button");
      fireEvent.click(addButton);
      expect(mockAddQuestions).toHaveBeenCalledWith(mockQuestion);
    });

    it("removes question from form when add button is clicked", () => {
      mockSurveyTemplateFormStore.setState({
        questions: [
          {
            ...mockQuestion,
            order: 1,
            required: false,
          },
        ],
      });
      render(<QuestionListItem question={mockQuestion} />);

      const addButton = screen.getByTestId("add-question-button");
      fireEvent.click(addButton);
      expect(mockRemoveQuestion).toHaveBeenCalledWith(mockQuestion.id);
    });
  });

  describe("Question data variations", () => {
    it("handles question with no responses", () => {
      const questionWithNoResponses = { ...mockQuestion, answerCount: 0 };
      render(<QuestionListItem question={questionWithNoResponses} />);

      expect(screen.getByText("0 responses")).toBeInTheDocument();
    });

    it("handles different question types", () => {
      const textQuestion = { ...mockQuestion, type: "text" as const };
      render(<QuestionListItem question={textQuestion} />);

      expect(screen.getByTestId("question-type-badge")).toHaveTextContent(
        "text",
      );
    });

    it("handles long question titles", () => {
      const longTitleQuestion = {
        ...mockQuestion,
        title:
          "This is a very long question title that should be handled properly by the component",
      };
      render(<QuestionListItem question={longTitleQuestion} />);

      expect(screen.getByText(longTitleQuestion.title)).toBeInTheDocument();
    });
  });
});
