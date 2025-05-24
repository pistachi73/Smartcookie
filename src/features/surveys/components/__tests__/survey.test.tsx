import setMockViewport from "@/shared/components/layout/viewport-context/test-utils/setMockViewport";
import { cleanup, render, screen } from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSurvey } from "../../hooks/use-survey";
import { useSurveyStore } from "../../store/survey-store-provider";
import type { SurveyStoreState } from "../../store/survey.store";
import { Survey } from "../survey";

// Mock all child components
vi.mock("../survey-presentation", () => ({
  SurveyPresentation: ({ surveyId }: { surveyId: string }) => (
    <div data-testid="survey-presentation">Survey Presentation {surveyId}</div>
  ),
}));

vi.mock("../survey-question", () => ({
  SurveyQuestion: ({ question, step }: { question: any; step: number }) => (
    <div data-testid="survey-question">
      Question {step}: {question?.title || "No Question"}
    </div>
  ),
}));

vi.mock("../survey-thank-you", () => ({
  default: () => <div data-testid="survey-thank-you">Thank You</div>,
}));

vi.mock("../survey-not-found", () => ({
  SurveyNotFound: () => (
    <div data-testid="survey-not-found">Survey Not Found</div>
  ),
}));

vi.mock("../survey-out-boundaries", () => ({
  SurveyOutBoundaries: () => (
    <div data-testid="survey-out-boundaries">Out of Boundaries</div>
  ),
}));

vi.mock("../survey-progress-bar", () => ({
  SurveyProgressBar: ({ surveyId }: { surveyId: string }) => (
    <div data-testid="survey-progress-bar">Progress Bar {surveyId}</div>
  ),
}));

vi.mock("../survey-bottom-bar", () => ({
  SurveyBottomBar: () => <div data-testid="survey-bottom-bar">Bottom Bar</div>,
}));

// Mock motion components
vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animate-presence">{children}</div>
  ),
}));

vi.mock("motion/react-m", () => ({
  div: ({ children, ...props }: any) => (
    <div data-testid="motion-div" {...props}>
      {children}
    </div>
  ),
}));

// Mock hooks
vi.mock("../../hooks/use-survey", () => ({
  useSurvey: vi.fn(),
}));

vi.mock("../../store/survey-store-provider", () => ({
  useSurveyStore: vi.fn(),
}));

const mockSetIsTransitioning = vi.fn();

const initialState = {
  _isHydrated: true,
  step: 1,
  totalSteps: 4,
  totalQuestions: 3,
  direction: 1 as const,
  responses: {},
  surveyResponseData: {},
  isTransitioning: false,
  setIsTransitioning: mockSetIsTransitioning,
};

const mockStore = mockZustandStoreImplementation<SurveyStoreState>({
  hook: useSurveyStore,
  initialState,
});

const mockSurveyData = {
  id: 1,
  title: "Test Survey",
  description: "Test Description",
  questions: [
    {
      id: 1,
      title: "Question 1",
      description: "First question",
      type: "text" as const,
      required: true,
      enableAdditionalComment: false,
      order: 1,
    },
    {
      id: 2,
      title: "Question 2",
      description: "Second question",
      type: "rating" as const,
      required: true,
      enableAdditionalComment: false,
      order: 2,
    },
    {
      id: 3,
      title: "Question 3",
      description: "Third question",
      type: "boolean" as const,
      required: true,
      enableAdditionalComment: false,
      order: 3,
    },
  ],
};

describe("Survey", () => {
  const surveyId = "test-survey-123";

  beforeEach(() => {
    setMockViewport("xl");
    mockStore.resetState();

    vi.mocked(useSurvey).mockReturnValue({
      data: mockSurveyData,
      isLoading: false,
      error: null,
      isError: false,
    } as any);
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it("shows loading screen when not hydrated", () => {
    mockStore.setState({ _isHydrated: false });

    render(<Survey surveyId={surveyId} />);

    const loadingDiv = document.querySelector(".w-screen.h-screen.bg-bg");
    expect(loadingDiv).toBeInTheDocument();
  });

  it("shows survey not found when survey data is null", () => {
    vi.mocked(useSurvey).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isError: false,
    } as any);

    render(<Survey surveyId={surveyId} />);

    expect(screen.getByTestId("survey-not-found")).toBeInTheDocument();
  });

  it("shows out of boundaries when step is within range but question is missing", () => {
    // Create survey data with missing question for step 2
    const surveyWithMissingQuestion = {
      ...mockSurveyData,
      questions: [mockSurveyData.questions[0]], // Only first question
    };

    vi.mocked(useSurvey).mockReturnValue({
      data: surveyWithMissingQuestion,
      isLoading: false,
      error: null,
      isError: false,
    } as any);

    mockStore.setState({
      step: 2, // Valid step but question doesn't exist
      totalSteps: 4,
    });

    render(<Survey surveyId={surveyId} />);

    expect(screen.getByTestId("survey-out-boundaries")).toBeInTheDocument();
  });

  it("renders survey presentation on step 0", () => {
    mockStore.setState({ step: 0 });

    render(<Survey surveyId={surveyId} />);

    expect(screen.getByTestId("survey-presentation")).toBeInTheDocument();
    expect(
      screen.getByText(`Survey Presentation ${surveyId}`),
    ).toBeInTheDocument();

    // Should not show progress bar or bottom bar on boundary steps
    expect(screen.queryByTestId("survey-progress-bar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("survey-bottom-bar")).not.toBeInTheDocument();
  });

  it("renders survey question on valid question steps", () => {
    mockStore.setState({ step: 1 });

    render(<Survey surveyId={surveyId} />);

    expect(screen.getByTestId("survey-question")).toBeInTheDocument();
    expect(screen.getByText("Question 1: Question 1")).toBeInTheDocument();

    // Should show progress bar and bottom bar on question steps
    expect(screen.getByTestId("survey-progress-bar")).toBeInTheDocument();
    expect(screen.getByTestId("survey-bottom-bar")).toBeInTheDocument();
  });

  it("renders thank you page on final step", () => {
    mockStore.setState({
      step: 4, // totalSteps
      totalSteps: 4,
    });

    render(<Survey surveyId={surveyId} />);

    expect(screen.getByTestId("survey-thank-you")).toBeInTheDocument();

    // Should not show progress bar or bottom bar on boundary steps
    expect(screen.queryByTestId("survey-progress-bar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("survey-bottom-bar")).not.toBeInTheDocument();
  });

  it("renders different questions based on current step", () => {
    const { rerender } = render(<Survey surveyId={surveyId} />);

    // Step 1 - First question
    mockStore.setState({ step: 1 });
    rerender(<Survey surveyId={surveyId} />);
    expect(screen.getByText("Question 1: Question 1")).toBeInTheDocument();

    // Step 2 - Second question
    mockStore.setState({ step: 2 });
    rerender(<Survey surveyId={surveyId} />);
    expect(screen.getByText("Question 2: Question 2")).toBeInTheDocument();

    // Step 3 - Third question
    mockStore.setState({ step: 3 });
    rerender(<Survey surveyId={surveyId} />);
    expect(screen.getByText("Question 3: Question 3")).toBeInTheDocument();
  });
});
