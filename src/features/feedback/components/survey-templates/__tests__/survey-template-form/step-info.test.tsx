import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";
import { useSurveyTemplateFormStore } from "../../../../store/survey-template-form.store";
import type { SurveyTemplateFormState } from "../../../../types/survey-template-form-store.types";
import { StepInfo } from "../../survey-template-form/step-info";

vi.mock("../../../../store/survey-template-form.store", () => ({
  useSurveyTemplateFormStore: vi.fn(),
}));

const mockStore = mockZustandStoreImplementation<SurveyTemplateFormState>({
  hook: useSurveyTemplateFormStore,
  initialState: {
    surveyInfo: {
      title: "",
      description: "",
    },
    mode: "create",
    setFormData: vi.fn(),
    nextStep: vi.fn(),
    currentStep: 1,
    totalSteps: 3,
    reset: vi.fn(),
  },
});

describe("StepInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.resetState();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Component Structure", () => {
    it("renders form with title and description fields", () => {
      render(<StepInfo />);

      expect(
        screen.getByRole("textbox", { name: /survey title/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /description/i }),
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText("e.g., Student Experience Survey"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Brief explanation of the survey purpose"),
      ).toBeInTheDocument();

      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("renders required indicator for title field", () => {
      render(<StepInfo />);

      const titleField = screen.getByRole("textbox", { name: /survey title/i });
      expect(titleField).toHaveAttribute("aria-required", "true");
    });

    it("sets autofocus on title field", () => {
      render(<StepInfo />);

      const titleField = screen.getByRole("textbox", { name: /survey title/i });
      expect(titleField).toHaveFocus();
    });

    it("sets correct maxLength attributes", () => {
      render(<StepInfo />);

      const titleField = screen.getByRole("textbox", { name: /survey title/i });
      const descriptionField = screen.getByRole("textbox", {
        name: /description/i,
      });

      expect(titleField).toHaveAttribute("maxlength", "255");
      expect(descriptionField).toHaveAttribute("maxlength", "1000");
    });
  });

  describe("Form Validation", () => {
    it("prevents submission with empty title and shows error message", async () => {
      const mockNextStep = vi.fn();
      mockStore.setState({ nextStep: mockNextStep });

      render(<StepInfo />);

      const submitButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });

      expect(mockNextStep).not.toHaveBeenCalled();
    });

    it("allows submission with valid title", async () => {
      const mockSetFormData = vi.fn();
      const mockNextStep = vi.fn();
      mockStore.setState({
        setFormData: mockSetFormData,
        nextStep: mockNextStep,
      });

      render(<StepInfo />);

      const titleField = screen.getByRole("textbox", { name: /survey title/i });
      const submitButton = screen.getByRole("button", { name: /next/i });

      fireEvent.change(titleField, { target: { value: "Test Survey" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalledWith({
          title: "Test Survey",
          description: "",
        });
        expect(mockNextStep).toHaveBeenCalledOnce();
      });
    });

    it("validates title length constraints", async () => {
      render(<StepInfo />);

      const titleField = screen.getByRole("textbox", { name: /survey title/i });
      const longTitle = "a".repeat(256);

      fireEvent.change(titleField, { target: { value: longTitle } });
      fireEvent.blur(titleField);

      await waitFor(() => {
        expect(
          screen.getByText("Title must be at most 255 characters"),
        ).toBeInTheDocument();
      });
    });

    it("validates description length constraints", async () => {
      render(<StepInfo />);

      const descriptionField = screen.getByRole("textbox", {
        name: /description/i,
      });
      const longDescription = "a".repeat(1001);

      fireEvent.change(descriptionField, {
        target: { value: longDescription },
      });
      fireEvent.blur(descriptionField);

      await waitFor(() => {
        expect(
          screen.getByText("Description must be at most 1000 characters"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Store Integration", () => {
    it("loads initial values from store", () => {
      mockStore.setState({
        surveyInfo: {
          title: "Existing Survey",
          description: "Existing description",
        },
      });

      render(<StepInfo />);

      expect(screen.getByDisplayValue("Existing Survey")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Existing description"),
      ).toBeInTheDocument();
    });

    it("calls setFormData with form values on submission", async () => {
      const mockSetFormData = vi.fn();
      const mockNextStep = vi.fn();
      mockStore.setState({
        setFormData: mockSetFormData,
        nextStep: mockNextStep,
      });

      render(<StepInfo />);

      const titleField = screen.getByRole("textbox", { name: /survey title/i });
      const descriptionField = screen.getByRole("textbox", {
        name: /description/i,
      });
      const submitButton = screen.getByRole("button", { name: /next/i });

      fireEvent.change(titleField, { target: { value: "New Survey" } });
      fireEvent.change(descriptionField, {
        target: { value: "New description" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalledWith({
          title: "New Survey",
          description: "New description",
        });
      });
    });

    it("calls nextStep after successful form submission", async () => {
      const mockNextStep = vi.fn();
      mockStore.setState({ nextStep: mockNextStep });

      render(<StepInfo />);

      const titleField = screen.getByRole("textbox", { name: /survey title/i });
      const submitButton = screen.getByRole("button", { name: /next/i });

      fireEvent.change(titleField, { target: { value: "Test Survey" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNextStep).toHaveBeenCalledOnce();
      });
    });
  });

  describe("Mode Handling", () => {
    it("populates form fields in edit mode", () => {
      mockStore.setState({
        mode: "edit",
        surveyInfo: {
          title: "Edit Mode Survey",
          description: "Edit mode description",
        },
      });

      render(<StepInfo />);

      expect(screen.getByDisplayValue("Edit Mode Survey")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Edit mode description"),
      ).toBeInTheDocument();
    });

    it("updates form values when surveyInfo changes in edit mode", () => {
      mockStore.setState({
        mode: "edit",
        surveyInfo: {
          title: "Initial Title",
          description: "Initial Description",
        },
      });

      const { rerender } = render(<StepInfo />);

      expect(screen.getByDisplayValue("Initial Title")).toBeInTheDocument();

      mockStore.setState({
        surveyInfo: {
          title: "Updated Title",
          description: "Updated Description",
        },
      });

      rerender(<StepInfo />);

      expect(screen.getByDisplayValue("Updated Title")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Updated Description"),
      ).toBeInTheDocument();
    });

    it("handles empty values in edit mode", () => {
      mockStore.setState({
        mode: "edit",
        surveyInfo: {
          title: null as any,
          description: null as any,
        },
      });

      render(<StepInfo />);

      const titleField = screen.getByRole("textbox", { name: /survey title/i });
      const descriptionField = screen.getByRole("textbox", {
        name: /description/i,
      });

      expect(titleField).toHaveValue("");
      expect(descriptionField).toHaveValue("");
    });
  });

  describe("Accessibility", () => {
    it("shows error messages with proper accessibility attributes", async () => {
      render(<StepInfo />);

      const titleField = screen.getByRole("textbox", { name: /survey title/i });
      const submitButton = screen.getByRole("button", { name: /next/i });

      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/title is required/i);
        expect(errorMessage).toBeInTheDocument();
        expect(titleField).toHaveAttribute("aria-invalid", "true");
      });
    });
  });
});
