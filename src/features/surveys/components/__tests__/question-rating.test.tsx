import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";

import { useSubmitSurvey } from "../../hooks/use-submit-survey";
import type { SurveyStoreState } from "../../store/survey.store";
import { useSurveyStore } from "../../store/survey-store-provider";
import { SurveyQuestion } from "../survey-question";

const ratingQuestion = {
  id: 2,
  title: "How would you rate our service?",
  description: "Please rate from 1 to 10",
  type: "rating" as const,
  required: true,
  enableAdditionalComment: false,
  order: 1,
};

vi.mock("../../store/survey-store-provider", () => ({
  useSurveyStore: vi.fn(),
}));

vi.mock("../../hooks/use-submit-survey", () => ({
  useSubmitSurvey: vi.fn(),
}));

const mockSetResponse = vi.fn();
const mockGoToNextStep = vi.fn();

const initialState = {
  responses: {},
  setResponse: mockSetResponse,
  goToNextStep: mockGoToNextStep,
  totalQuestions: 3,
};

const mockStore = mockZustandStoreImplementation<SurveyStoreState>({
  hook: useSurveyStore,
  initialState,
});

describe("Question Rating", () => {
  const mockMutateSubmit = vi.fn();

  beforeEach(() => {
    vi.mocked(useSubmitSurvey as any).mockReturnValue({
      mutate: mockMutateSubmit,
      isPending: false,
    });
    mockStore.resetState();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it("should render all 10 rating options (1-10)", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={ratingQuestion} step={12} />);

    const options = screen.getAllByRole("radio");
    expect(options).toHaveLength(10);

    // Check that all options 1-10 are rendered
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }

    // Check that no option is initially selected
    options.forEach((option) => {
      expect(option).not.toBeChecked();
    });
  });

  it("should check the correct radio input value when selected", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={ratingQuestion} step={12} />);

    // Click on rating "7"
    const rating7 = screen.getByRole("radio", { name: "7 rating" });
    fireEvent.click(rating7);

    // Check that the correct radio is selected
    expect(rating7).toBeChecked();

    // Check that other radios are not selected
    const rating5 = screen.getByRole("radio", { name: "5 rating" });
    expect(rating5).not.toBeChecked();
  });

  it("should update form value when radio is selected", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={ratingQuestion} step={12} />);

    // Click on rating "8"
    const rating8 = screen.getByRole("radio", { name: "8 rating" });
    fireEvent.click(rating8);

    // Check that setResponse was called with correct values
    expect(mockSetResponse).toHaveBeenCalledWith(ratingQuestion.id, "8");
  });

  it("should reflect pre-selected value from store", () => {
    mockStore.setState({
      totalQuestions: 200,
      responses: { [ratingQuestion.id]: "6" },
    });
    render(<SurveyQuestion question={ratingQuestion} step={12} />);

    // Check that rating "6" is pre-selected
    const rating6 = screen.getByRole("radio", { name: "6 rating" });
    expect(rating6).toBeChecked();
  });

  it("should handle keyboard input for rating selection", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={ratingQuestion} step={12} />);

    // Simulate pressing "3" key
    fireEvent.keyDown(window, { key: "3" });

    // Wait for the key buffer timeout
    setTimeout(() => {
      const rating3 = screen.getByRole("radio", { name: "3 rating" });
      expect(rating3).toBeChecked();
      expect(mockSetResponse).toHaveBeenCalledWith(ratingQuestion.id, "3");
    }, 250);
  });

  it("should select value 10 when clicked", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={ratingQuestion} step={12} />);

    // Click on rating "10"
    const rating10 = screen.getByRole("radio", { name: "10 rating" });
    fireEvent.click(rating10);

    // Check that rating "10" is selected
    expect(rating10).toBeChecked();

    // Check that setResponse was called with "10"
    expect(mockSetResponse).toHaveBeenCalledWith(ratingQuestion.id, "10");

    // Verify other ratings are not selected
    const rating1 = screen.getByRole("radio", { name: "1 rating" });
    const rating9 = screen.getByRole("radio", { name: "9 rating" });
    expect(rating1).not.toBeChecked();
    expect(rating9).not.toBeChecked();
  });

  it("should handle keyboard input '0' to select rating 10", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={ratingQuestion} step={12} />);

    // Simulate pressing "0" key (should select "10")
    fireEvent.keyDown(window, { key: "0" });

    // Wait for the key buffer timeout
    setTimeout(() => {
      const rating10 = screen.getByRole("radio", { name: "10 rating" });
      expect(rating10).toBeChecked();
      expect(mockSetResponse).toHaveBeenCalledWith(ratingQuestion.id, "10");
    }, 250);
  });

  it("should handle keyboard input '1' then '0' to select rating 10", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={ratingQuestion} step={12} />);

    // Simulate pressing "1" then "0" keys quickly
    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "0" });

    // Wait for the key buffer timeout
    setTimeout(() => {
      const rating10 = screen.getByRole("radio", { name: "10 rating" });
      expect(rating10).toBeChecked();
      expect(mockSetResponse).toHaveBeenCalledWith(ratingQuestion.id, "10");
    }, 250);
  });
});
