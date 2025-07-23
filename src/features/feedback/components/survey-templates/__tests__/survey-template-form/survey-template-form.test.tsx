import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the store before any imports
vi.mock("../../../../store/survey-template-form.store");

import { cleanup, render, screen } from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";

import { useSurveyTemplateFormStore } from "../../../../store/survey-template-form.store";
import type { SurveyTemplateFormState } from "../../../../types/survey-template-form-store.types";
import { SurveyTemplateForm } from "../../survey-template-form/index";

// Mock the step components
vi.mock("../../survey-template-form/step-info", () => ({
  StepInfo: () => <div data-testid="step-info">Step Info Component</div>,
}));

vi.mock("../../survey-template-form/step-survey-questions", () => ({
  StepSurveyQuestions: () => (
    <div data-testid="step-survey-questions">
      Step Survey Questions Component
    </div>
  ),
}));

vi.mock("../../survey-template-form/step-preview", () => ({
  StepPreview: () => (
    <div data-testid="step-preview">Step Preview Component</div>
  ),
}));

describe("SurveyTemplateForm", () => {
  const mockStore = mockZustandStoreImplementation<SurveyTemplateFormState>({
    hook: useSurveyTemplateFormStore,
    initialState: {
      currentStep: 1,
      totalSteps: 3,
      reset: vi.fn(),
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.resetState();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Component Structure", () => {
    it("renders the main container with proper structure", () => {
      render(<SurveyTemplateForm />);

      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
      expect(screen.getByText("Survey Information")).toBeInTheDocument();
      expect(
        screen.getByText("Update the basic information about your survey."),
      ).toBeInTheDocument();
    });

    it("renders the multistep form progress component", () => {
      render(<SurveyTemplateForm />);

      // The MultistepFormProgress component should be rendered
      // We can't easily test its internal structure without mocking it,
      // but we can verify the step content is rendered
      expect(screen.getByTestId("step-info")).toBeInTheDocument();
    });
  });

  describe("Step Navigation and Content", () => {
    it("renders Step 1 (Info) content when currentStep is 1", () => {
      mockStore.setState({
        currentStep: 1,
        totalSteps: 3,
      });

      render(<SurveyTemplateForm />);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Survey Information",
      );
      expect(
        screen.getByText("Update the basic information about your survey."),
      ).toBeInTheDocument();
      expect(screen.getByTestId("step-info")).toBeInTheDocument();
      expect(
        screen.queryByTestId("step-survey-questions"),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId("step-preview")).not.toBeInTheDocument();
    });
    it("renders Step 2 (Questions) content when currentStep is 2", () => {
      mockStore.setState({
        currentStep: 2,
        totalSteps: 3,
      });

      render(<SurveyTemplateForm />);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Survey Questions",
      );
      expect(
        screen.getByText("Modify and reorder the questions for your survey."),
      ).toBeInTheDocument();
      expect(screen.getByTestId("step-survey-questions")).toBeInTheDocument();
      expect(screen.queryByTestId("step-info")).not.toBeInTheDocument();
      expect(screen.queryByTestId("step-preview")).not.toBeInTheDocument();
    });

    it("renders Step 3 (Preview) content when currentStep is 3", () => {
      mockStore.setState({
        currentStep: 3,
        totalSteps: 3,
      });

      render(<SurveyTemplateForm />);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Review Changes",
      );
      expect(
        screen.getByText("Review your changes before updating the survey."),
      ).toBeInTheDocument();
      expect(screen.getByTestId("step-preview")).toBeInTheDocument();
      expect(screen.queryByTestId("step-info")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("step-survey-questions"),
      ).not.toBeInTheDocument();
    });

    it("defaults to Step 1 content when currentStep is invalid", () => {
      mockStore.setState({
        currentStep: 999,
        totalSteps: 3,
      });

      render(<SurveyTemplateForm />);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Survey Information",
      );
      expect(screen.getByTestId("step-info")).toBeInTheDocument();
    });
  });

  describe("Store Integration", () => {
    it("reads currentStep from the store", () => {
      mockStore.setState({ currentStep: 2 });

      render(<SurveyTemplateForm />);

      expect(screen.getByTestId("step-survey-questions")).toBeInTheDocument();
    });

    it("calls reset function on component unmount", () => {
      const mockReset = vi.fn();
      mockStore.setState({ reset: mockReset });

      const { unmount } = render(<SurveyTemplateForm />);

      expect(mockReset).not.toHaveBeenCalled();

      unmount();

      expect(mockReset).toHaveBeenCalledOnce();
    });
  });

  describe("Invalid Step Handling", () => {
    const invalidStepCases = [
      { value: undefined, description: "undefined" },
      { value: 0, description: "zero" },
      { value: -1, description: "negative" },
      { value: 4, description: "out of range (too high)" },
      { value: null, description: "null" },
    ];

    it.each(invalidStepCases)(
      "handles $description currentStep gracefully",
      ({ value }) => {
        mockStore.setState({
          currentStep: value as any,
          totalSteps: 3,
        });

        render(<SurveyTemplateForm />);

        expect(screen.getByTestId("step-info")).toBeInTheDocument();
      },
    );
  });
});
