import { useRouter, useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockNextNavigation } from "@/shared/lib/testing/navigation-mocks";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";

import { useSurveyTemplateFormStore } from "../../../../store/survey-template-form.store";
import type { SurveyTemplateFormState } from "../../../../types/survey-template-form-store.types";
import { StepSurveyQuestions } from "../../survey-template-form/step-survey-questions";

mockNextNavigation();

// Mock the complex dependencies
vi.mock("@/shared/hooks/use-navigate-with-params");

vi.mock("react-aria", () => ({
  useDrop: vi.fn(() => ({
    dropProps: {},
    isDropTarget: false,
  })),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  LayoutGroup: ({ children }: any) => <div>{children}</div>,
  Reorder: {
    Group: ({ children, values, onReorder, ...props }: any) => (
      <div data-testid="reorder-group" {...props}>
        {children}
      </div>
    ),
    Item: ({ children, value, ...props }: any) => (
      <div data-testid={`reorder-item-${value.id}`} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../template-question", () => ({
  TemplateQuestion: ({ id, title, type, order, required }: any) => (
    <div data-testid={`template-question-${id}`}>
      <span data-testid="question-order">{order}</span>
      <span data-testid="question-title">{title}</span>
      <span data-testid="question-type">{type}</span>
      <span data-testid="question-required">
        {required ? "required" : "optional"}
      </span>
    </div>
  ),
}));

vi.mock("../../../../store/survey-template-form.store", () => ({
  useSurveyTemplateFormStore: vi.fn(),
}));

const mockQuestions = [
  {
    id: 1,
    title: "How satisfied are you?",
    description: "Rate your satisfaction level",
    type: "rating" as const,
    enableAdditionalComment: false,
    updatedAt: "2024-01-01T00:00:00Z",
    answerCount: 5,
    required: true,
    order: 1,
  },
  {
    id: 2,
    title: "Any additional comments?",
    description: null,
    type: "text" as const,
    enableAdditionalComment: true,
    updatedAt: "2024-01-02T00:00:00Z",
    answerCount: 3,
    required: false,
    order: 2,
  },
];

const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
};

const mockStore = mockZustandStoreImplementation<SurveyTemplateFormState>({
  hook: useSurveyTemplateFormStore,
  initialState: {
    questions: [],
    nextStep: vi.fn(),
    prevStep: vi.fn(),
    addQuestion: vi.fn(),
    removeQuestion: vi.fn(),
    reorderQuestions: vi.fn(),
    updateQuestionSetting: vi.fn(),
    currentStep: 2,
    totalSteps: 3,
    reset: vi.fn(),
    surveyInfo: { title: "", description: "" },
    mode: "create",
    setFormData: vi.fn(),
  },
});

describe("StepSurveyQuestions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.resetState();
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as any);
  });

  afterEach(() => {
    cleanup();
  });

  describe("Component Structure", () => {
    it("renders navigation buttons", () => {
      render(<StepSurveyQuestions />);

      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("disables next button when no questions are selected", () => {
      mockStore.setState({ questions: [] });

      render(<StepSurveyQuestions />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      expect(nextButton).toHaveAttribute("data-disabled", "true");
    });

    it("enables next button when questions are present", () => {
      mockStore.setState({ questions: mockQuestions });

      render(<StepSurveyQuestions />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      expect(nextButton).not.toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Empty State", () => {
    it("shows empty state when no questions are selected", () => {
      mockStore.setState({ questions: [] });

      render(<StepSurveyQuestions />);

      expect(screen.getByText("No questions selected")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Select or drag questions from the sidebar to add them here",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Questions Display", () => {
    it("renders questions when present", () => {
      mockStore.setState({ questions: mockQuestions });

      render(<StepSurveyQuestions />);

      expect(screen.getByTestId("reorder-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("reorder-item-2")).toBeInTheDocument();
      expect(screen.getByTestId("reorder-group")).toBeInTheDocument();
    });

    it("displays question details correctly", () => {
      mockStore.setState({ questions: mockQuestions });

      render(<StepSurveyQuestions />);

      // Check questions are rendered with their titles
      expect(screen.getByText("How satisfied are you?")).toBeInTheDocument();
      expect(screen.getByText("Any additional comments?")).toBeInTheDocument();
    });

    it("renders questions in correct order", () => {
      mockStore.setState({ questions: mockQuestions });

      render(<StepSurveyQuestions />);

      // Check that both questions are rendered (order numbers are shown in badges)
      const orderBadges = screen.getAllByText("1");
      expect(orderBadges.length).toBeGreaterThan(0);

      const secondOrderBadges = screen.getAllByText("2");
      expect(secondOrderBadges.length).toBeGreaterThan(0);
    });
  });

  describe("Navigation", () => {
    it("calls prevStep when back button is clicked", () => {
      const mockPrevStep = vi.fn();
      mockStore.setState({ prevStep: mockPrevStep });

      render(<StepSurveyQuestions />);

      const backButton = screen.getByRole("button", { name: /back/i });
      fireEvent.click(backButton);

      expect(mockPrevStep).toHaveBeenCalledOnce();
    });

    it("calls nextStep when next button is clicked and questions exist", () => {
      const mockNextStep = vi.fn();
      mockStore.setState({
        nextStep: mockNextStep,
        questions: mockQuestions,
      });

      render(<StepSurveyQuestions />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);

      expect(mockNextStep).toHaveBeenCalledOnce();
    });
  });

  describe("Question Actions", () => {
    it("renders settings button for each question", () => {
      mockStore.setState({ questions: mockQuestions });

      render(<StepSurveyQuestions />);

      const settingsButtons = screen.getAllByRole("button", { name: "" });
      // Filter for settings buttons (they have Settings01Icon)
      const settingsButtonsFiltered = settingsButtons.filter(
        (button) =>
          button.querySelector("svg") &&
          !button.textContent?.includes("Back") &&
          !button.textContent?.includes("Next"),
      );

      expect(settingsButtonsFiltered.length).toBeGreaterThan(0);
    });

    it("renders delete button for each question", () => {
      mockStore.setState({ questions: mockQuestions });

      render(<StepSurveyQuestions />);

      // Delete buttons should be present (they contain DeleteIcon)
      const allButtons = screen.getAllByRole("button");
      expect(allButtons.length).toBeGreaterThan(2); // More than just Back/Next buttons
    });
  });

  describe("URL Management", () => {
    it("updates URL when tab parameter is not 'questions'", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams("tab=surveys") as any,
      );

      render(<StepSurveyQuestions />);

      expect(mockRouter.push).toHaveBeenCalled();
    });

    it("does not update URL when tab parameter is already 'questions'", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams("tab=questions") as any,
      );

      render(<StepSurveyQuestions />);

      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe("Store Integration", () => {
    it("reads questions from store", () => {
      const customQuestions = [
        {
          id: 3,
          title: "Test Question",
          description: "Test description",
          type: "text" as const,
          enableAdditionalComment: false,
          updatedAt: "2024-01-01T00:00:00Z",
          answerCount: 0,
          required: true,
          order: 1,
        },
      ];
      mockStore.setState({ questions: customQuestions });

      render(<StepSurveyQuestions />);

      expect(screen.getByTestId("reorder-item-3")).toBeInTheDocument();
      expect(screen.getByText("Test Question")).toBeInTheDocument();
    });

    it("uses store actions for navigation", () => {
      const mockNextStep = vi.fn();
      const mockPrevStep = vi.fn();
      mockStore.setState({
        nextStep: mockNextStep,
        prevStep: mockPrevStep,
        questions: mockQuestions,
      });

      render(<StepSurveyQuestions />);

      fireEvent.click(screen.getByRole("button", { name: /back/i }));
      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      expect(mockPrevStep).toHaveBeenCalledOnce();
      expect(mockNextStep).toHaveBeenCalledOnce();
    });
  });
});
