import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCreateSurvey } from "@/features/feedback/hooks/survey-templates/use-create-survey";
import { useUpdateSurvey } from "@/features/feedback/hooks/survey-templates/use-update-survey";
import { mockNextNavigation } from "@/shared/lib/testing/navigation-mocks";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSurveyTemplateFormStore } from "../../../../store/survey-template-form.store";
import type { SurveyTemplateFormState } from "../../../../types/survey-template-form-store.types";
import { StepPreview } from "../../survey-template-form/step-preview";

mockNextNavigation();

// Mock dependencies
vi.mock("@/shared/hooks/use-navigate-with-params", () => ({
  default: () => ({
    createHrefWithParams: vi.fn((pathname) => pathname),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/features/feedback/hooks/survey-templates/use-create-survey", () => ({
  useCreateSurvey: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock("@/features/feedback/hooks/survey-templates/use-update-survey", () => ({
  useUpdateSurvey: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock("../../questions/question-type-badge", () => ({
  QuestionTypeBadge: ({ type, label }: any) => (
    <div data-testid={`question-badge-${label}`}>
      <span data-testid="badge-type">{type}</span>
      <span data-testid="badge-label">{label}</span>
    </div>
  ),
}));

vi.mock("./question-change-indicators", () => ({
  QuestionChangeIndicators: ({ changes }: any) => (
    <div data-testid="change-indicators">
      {changes.map((change: any, index: number) => (
        <span key={index} data-testid={`change-${change.type}`}>
          {change.message}
        </span>
      ))}
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

const mockSurveyInfo = {
  title: "Test Survey",
  description: "Test Description",
};

const mockStore = mockZustandStoreImplementation<SurveyTemplateFormState>({
  hook: useSurveyTemplateFormStore,
  initialState: {
    surveyInfo: mockSurveyInfo,
    questions: mockQuestions,
    mode: "create",
    prevStep: vi.fn(),
    getChanges: vi.fn(() => ({
      added: [],
      removed: [],
      updated: [],
      reordered: false,
    })),
    currentStep: 3,
    totalSteps: 3,
    originalQuestions: [],
  },
});

const mockRouter = {
  push: vi.fn(),
};

describe("StepPreview", () => {
  const mockCreateSurvey = vi.fn();
  const mockUpdateSurvey = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.resetState();
    vi.mocked(useRouter).mockReturnValue(mockRouter as any);

    vi.mocked(useCreateSurvey).mockReturnValue({
      mutate: mockCreateSurvey,
      isPending: false,
    } as any);

    vi.mocked(useUpdateSurvey).mockReturnValue({
      mutate: mockUpdateSurvey,
      isPending: false,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  describe("Component Structure", () => {
    it("renders survey title and description", () => {
      render(<StepPreview />);

      expect(screen.getByText(mockSurveyInfo.title)).toBeInTheDocument();
      expect(screen.getByText(mockSurveyInfo.description)).toBeInTheDocument();
    });

    it("renders survey title without description when description is empty", () => {
      mockStore.setState({
        surveyInfo: { title: "Survey Without Description", description: "" },
      });

      render(<StepPreview />);
      expect(
        screen.queryByText(mockSurveyInfo.description),
      ).not.toBeInTheDocument();
    });

    it("renders navigation buttons", () => {
      render(<StepPreview />);

      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create survey/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Questions Display", () => {
    it("shows questions count", () => {
      render(<StepPreview />);

      expect(screen.getByText("Questions (2)")).toBeInTheDocument();
    });

    it("renders questions with correct details", () => {
      render(<StepPreview />);

      expect(screen.getByText("How satisfied are you?")).toBeInTheDocument();
      expect(screen.getByText("Any additional comments?")).toBeInTheDocument();
      expect(
        screen.getByText("Rate your satisfaction level"),
      ).toBeInTheDocument();
    });

    it("shows required indicator for required questions", () => {
      render(<StepPreview />);

      const requiredIndicators = screen.getAllByText("*");
      expect(requiredIndicators).toHaveLength(1);
    });

    it("renders question badges with correct order", () => {
      render(<StepPreview />);

      const questionNumbers = screen.getAllByText(/^[12]$/);
      expect(questionNumbers).toHaveLength(2);
      expect(questionNumbers[0]).toHaveTextContent("1");
      expect(questionNumbers[1]).toHaveTextContent("2");
    });

    it("shows empty state when no questions", () => {
      mockStore.setState({ questions: [] });

      render(<StepPreview />);

      expect(screen.getByText("Questions (0)")).toBeInTheDocument();
      expect(screen.getByText("No questions selected")).toBeInTheDocument();
    });
  });

  describe("Create Mode", () => {
    beforeEach(() => {
      mockStore.setState({ mode: "create" });
    });

    it("shows create button text", () => {
      render(<StepPreview />);

      expect(
        screen.getByRole("button", { name: /create survey/i }),
      ).toBeInTheDocument();
    });

    it("calls createSurvey when form is submitted", () => {
      render(<StepPreview />);

      const submitButton = screen.getByRole("button", {
        name: /create survey/i,
      });
      fireEvent.click(submitButton);

      expect(mockCreateSurvey).toHaveBeenCalledWith({
        title: mockSurveyInfo.title,
        description: mockSurveyInfo.description,
        questions: [
          { id: 1, required: true },
          { id: 2, required: false },
        ],
      });
    });

    it("shows error when title is missing", () => {
      mockStore.setState({
        surveyInfo: {
          ...mockSurveyInfo,
          title: "",
        },
      });

      render(<StepPreview />);

      const submitButton = screen.getByRole("button", {
        name: /create survey/i,
      });
      fireEvent.click(submitButton);

      expect(toast.error).toHaveBeenCalledWith("Title is required");
      expect(mockCreateSurvey).not.toHaveBeenCalled();
    });
  });

  describe("Edit Mode", () => {
    beforeEach(() => {
      mockStore.setState({
        mode: "edit",
        surveyInfo: {
          ...mockSurveyInfo,
          id: 1,
        },
      });
    });

    it("shows update button text", () => {
      render(<StepPreview />);

      expect(
        screen.getByRole("button", { name: /update survey/i }),
      ).toBeInTheDocument();
    });

    it("calls updateSurvey when form is submitted", () => {
      mockStore.setState({
        questions: [
          {
            ...mockQuestions[0],
            surveyTemplateQuestionId: 1,
          } as any,
          {
            ...mockQuestions[1],
            surveyTemplateQuestionId: 2,
          } as any,
        ],
      });
      render(<StepPreview />);

      const submitButton = screen.getByRole("button", {
        name: /update survey/i,
      });
      fireEvent.click(submitButton);

      expect(mockUpdateSurvey).toHaveBeenCalledWith({
        id: 1,
        ...mockSurveyInfo,
        questions: [
          {
            id: 1,
            required: true,
            order: 1,
            surveyTemplateQuestionId: 1,
          },
          {
            id: 2,
            required: false,
            order: 2,
            surveyTemplateQuestionId: 2,
          },
        ],
      });
    });

    it("shows error when survey ID is missing", () => {
      mockStore.setState({
        surveyInfo: { title: "Edit Survey", description: "Edit Description" },
      });

      render(<StepPreview />);

      const submitButton = screen.getByRole("button", {
        name: /update survey/i,
      });
      fireEvent.click(submitButton);

      expect(toast.error).toHaveBeenCalledWith(
        "Survey ID is required for editing",
      );
      expect(mockUpdateSurvey).not.toHaveBeenCalled();
    });

    it("shows change indicators in edit mode", () => {
      const mockGetChanges = vi.fn(() => ({
        added: [],
        removed: [],
        updated: [
          {
            id: 1,
            changes: [
              { type: "settings_changed", message: "Required changed" },
            ],
          },
        ],
        reordered: false,
      })) as any;

      mockStore.setState({
        mode: "edit",
        getChanges: mockGetChanges,
      });

      render(<StepPreview />);

      // In edit mode, there should be change indicator buttons for questions with changes
      const changeButtons = screen
        .getAllByRole("button")
        .filter(
          (button) =>
            button.querySelector("svg") &&
            !button.textContent?.includes("Back") &&
            !button.textContent?.includes("Update"),
        );
      expect(changeButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Loading States", () => {
    it("shows loading state when creating", () => {
      vi.mocked(useCreateSurvey).mockReturnValue({
        mutate: mockCreateSurvey,
        isPending: true,
      } as any);
      render(<StepPreview />);

      const submitButton = screen.getByRole("button", { name: /creating/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute("aria-disabled", "true");
      expect(screen.getByRole("button", { name: /back/i })).toHaveAttribute(
        "data-disabled",
        "true",
      );
    });

    it("shows loading state when updating", () => {
      vi.mocked(useUpdateSurvey).mockReturnValue({
        mutate: mockUpdateSurvey,
        isPending: true,
      } as any);
      mockStore.setState({ mode: "edit" });

      render(<StepPreview />);

      const submitButton = screen.getByRole("button", { name: /updating/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute("aria-disabled", "true");
      expect(screen.getByRole("button", { name: /back/i })).toHaveAttribute(
        "data-disabled",
        "true",
      );
    });
  });

  describe("Navigation", () => {
    it("calls prevStep when back button is clicked", () => {
      const mockPrevStep = vi.fn();
      mockStore.setState({ prevStep: mockPrevStep });

      render(<StepPreview />);

      const backButton = screen.getByRole("button", { name: /back/i });
      fireEvent.click(backButton);

      expect(mockPrevStep).toHaveBeenCalledOnce();
    });

    it("navigates to feedback page on successful creation", async () => {
      let onSuccessCallback: () => void;
      vi.mocked(useCreateSurvey).mockImplementation(({ onSuccess }: any) => {
        onSuccessCallback = onSuccess;
        return { mutate: mockCreateSurvey, isPending: false } as any;
      });

      render(<StepPreview />);

      // Trigger the success callback
      onSuccessCallback!();

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/portal/feedback/");
      });
    });
  });
});
