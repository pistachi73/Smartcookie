import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";

import { useStudentHasSurveyAccess } from "../../hooks/use-student-has-survey-access";
import { useSurvey } from "../../hooks/use-survey";
import { useSurveyNavigation } from "../../hooks/use-survey-navigation";
import type { SurveyStoreState } from "../../store/survey.store";
import { useSurveyStore } from "../../store/survey-store-provider";
import { SurveyPresentation } from "../survey-presentation";

vi.mock("../../store/survey-store-provider", () => ({
  useSurveyStore: vi.fn(),
}));

vi.mock("../../hooks/use-student-has-survey-access", () => ({
  useStudentHasSurveyAccess: vi.fn(),
}));

vi.mock("../../hooks/use-survey-navigation", () => ({
  useSurveyNavigation: vi.fn(),
}));

vi.mock("../../hooks/use-survey", () => ({
  useSurvey: vi.fn(),
}));

const mockGoToNextStep = vi.fn();
const mockSetSurveyResponseData = vi.fn();
const mockSetIsTransitioning = vi.fn();

const initialState = {
  surveyResponseData: {},
  goToNextStep: mockGoToNextStep,
  setSurveyResponseData: mockSetSurveyResponseData,
  setIsTransitioning: mockSetIsTransitioning,
  isTransitioning: false,
};

const mockStore = mockZustandStoreImplementation<SurveyStoreState>({
  hook: useSurveyStore,
  initialState,
});

const mockSurveyData = {
  id: 1,
  title: "Customer Satisfaction Survey",
  description: "Help us improve our products and services",
  questions: [
    {
      id: 1,
      title: "How satisfied are you?",
      description: "Rate your satisfaction",
      type: "rating" as const,
      required: true,
      enableAdditionalComment: false,
      order: 1,
    },
  ],
};

const mockUseSurveyReturn = {
  data: mockSurveyData,
  isLoading: false,
  error: null,
  isError: false,
  isFetching: false,
  isSuccess: true,
};

describe("SurveyPresentation", () => {
  const mockMutateAsync = vi.fn();
  const mockReset = vi.fn();
  const surveyId = "test-survey-123";

  // Helper function to submit form with email
  const submitForm = async (email: string) => {
    const emailInput = screen.getByLabelText("Student Email");
    const submitButton = screen.getByRole("button", { name: /start survey/i });

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.click(submitButton);

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    return { emailInput, submitButton };
  };

  beforeEach(() => {
    vi.mocked(useStudentHasSurveyAccess).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      data: undefined,
      reset: mockReset,
    } as any);

    vi.mocked(useSurveyNavigation).mockImplementation(() => {});
    vi.mocked(useSurvey).mockReturnValue(mockUseSurveyReturn as any);

    // Set up default mock response
    mockMutateAsync.mockResolvedValue({
      success: true,
      data: { id: 1, studentId: 123 },
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    mockStore.resetState();
    cleanup();
  });

  it("should render the survey title and description from survey data", () => {
    render(<SurveyPresentation surveyId={surveyId} />);

    expect(
      screen.getByRole("heading", { name: mockSurveyData.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(mockSurveyData.description)).toBeInTheDocument();
    expect(useSurvey).toHaveBeenCalledWith(surveyId);
  });

  it("should render email input field with correct attributes", () => {
    render(<SurveyPresentation surveyId={surveyId} />);

    const emailInput = screen.getByLabelText("Student Email");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute(
      "placeholder",
      "Enter your email to start the survey",
    );
    expect(emailInput).toHaveAttribute("name", "email");
  });

  it("should render submit button with correct text and icon", () => {
    render(<SurveyPresentation surveyId={surveyId} />);

    const submitButton = screen.getByRole("button", {
      name: /start survey/i,
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should show validation error for invalid email format", async () => {
    render(<SurveyPresentation surveyId={surveyId} />);

    await submitForm("invalid-email");

    expect(
      await screen.findByText("Invalid email address"),
    ).toBeInTheDocument();
  });

  it("should show validation error for empty email field", async () => {
    render(<SurveyPresentation surveyId={surveyId} />);

    const submitButton = screen.getByRole("button", {
      name: /start survey/i,
    });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Invalid email address"),
    ).toBeInTheDocument();
  });

  it("should not show validation errors for valid email", async () => {
    render(<SurveyPresentation surveyId={surveyId} />);

    await submitForm("test@example.com");

    expect(mockMutateAsync).toHaveBeenCalledWith({
      email: "test@example.com",
      surveyId,
    });
  });

  it("should pre-fill email field with value from surveyResponseData", () => {
    mockStore.setState({
      surveyResponseData: { email: "existing@example.com" },
    });

    render(<SurveyPresentation surveyId={surveyId} />);

    const emailInput = screen.getByLabelText("Student Email");
    expect(emailInput).toHaveValue("existing@example.com");
  });

  it("should call setIsTransitioning when form is submitted", async () => {
    render(<SurveyPresentation surveyId={surveyId} />);

    await submitForm("test@example.com");

    expect(mockSetIsTransitioning).toHaveBeenCalledWith(true);
  });

  it("should call goToNextStep when access check succeeds", async () => {
    render(<SurveyPresentation surveyId={surveyId} />);

    await submitForm("test@example.com");

    expect(mockGoToNextStep).toHaveBeenCalled();
  });

  it("should use isTransitioning state to prevent double submission", async () => {
    mockStore.setState({
      isTransitioning: true,
    });

    render(<SurveyPresentation surveyId={surveyId} />);

    await submitForm("test@example.com");

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("should reset isTransitioning when access check fails", async () => {
    mockMutateAsync.mockResolvedValue({
      success: false,
      message: "Access denied",
    });

    render(<SurveyPresentation surveyId={surveyId} />);

    await submitForm("test@example.com");

    expect(mockSetIsTransitioning).toHaveBeenCalledWith(false);
  });

  it("should proceed to next step when student has survey access", async () => {
    mockMutateAsync.mockResolvedValue({
      success: true,
      data: { id: 1, studentId: 123 },
      message: "Student has survey access",
    });

    render(<SurveyPresentation surveyId={surveyId} />);

    await submitForm("test@example.com");

    expect(mockGoToNextStep).toHaveBeenCalled();
    expect(mockSetSurveyResponseData).toHaveBeenCalledWith({
      email: "test@example.com",
      id: 1,
      studentId: 123,
      surveyTemplateId: mockSurveyData.id,
      startedAt: expect.any(String),
    });
  });

  it("should show error message when survey is already completed", async () => {
    const errorMessage = "Survey already completed.";

    // Mock the hook to return the error data
    vi.mocked(useStudentHasSurveyAccess).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      data: {
        success: false,
        message: errorMessage,
      },
      reset: mockReset,
    } as any);

    render(<SurveyPresentation surveyId={surveyId} />);
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it("should reset access data when email changes after failed check", async () => {
    vi.mocked(useStudentHasSurveyAccess).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      data: { success: false, message: "Access denied" },
      reset: mockReset,
    } as any);

    render(<SurveyPresentation surveyId={surveyId} />);

    const emailInput = screen.getByLabelText("Student Email");
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });

    expect(mockReset).toHaveBeenCalled();
  });
});
