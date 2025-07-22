import { useRouter } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockNextNavigation } from "@/shared/lib/testing/navigation-mocks";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";

import { useDeleteSurveyTemplate } from "../../../hooks/survey-templates/use-delete-survey-template";
import { DeleteSurveyTemplateModal } from "../delete-survey-template-modal";

mockNextNavigation();

vi.mock("../../../hooks/survey-templates/use-delete-survey-template", () => ({
  useDeleteSurveyTemplate: vi.fn(),
}));

vi.mock("@/shared/hooks/use-navigate-with-params");

const mockSurveyTemplate = {
  id: 1,
  title: "Customer Satisfaction Survey",
  description: "Help us improve our services",
};

const mockOnOpenChange = vi.fn();
const mockPush = vi.fn();

const defaultProps = {
  isOpen: true,
  onOpenChange: mockOnOpenChange,
  surveyTemplate: mockSurveyTemplate,
};

describe("DeleteSurveyTemplateModal", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    vi.mocked(useDeleteSurveyTemplate).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  describe("Basic rendering", () => {
    it("renders modal when open", () => {
      render(<DeleteSurveyTemplateModal {...defaultProps} />);

      expect(screen.getByText("Delete Survey")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Are you sure you want to delete this survey? This action cannot be undone.",
        ),
      ).toBeInTheDocument();
    });

    it("renders the expected content", () => {
      render(<DeleteSurveyTemplateModal {...defaultProps} />);

      expect(
        screen.getByText("Customer Satisfaction Survey"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Help us improve our services"),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^delete$/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("Important:")).toBeInTheDocument();
      expect(
        screen.getByText(/This survey template will be permanently deleted/),
      ).toBeInTheDocument();
    });
  });

  it("renders survey template without description", () => {
    const surveyWithoutDescription = {
      ...mockSurveyTemplate,
      description: null,
    };
    render(
      <DeleteSurveyTemplateModal
        {...defaultProps}
        surveyTemplate={surveyWithoutDescription}
      />,
    );

    expect(
      screen.queryByText("Help us improve our services"),
    ).not.toBeInTheDocument();
  });

  describe("User interactions", () => {
    it("calls onOpenChange when cancel button is clicked", () => {
      render(<DeleteSurveyTemplateModal {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls deleteSurveyTemplate when delete button is clicked", () => {
      render(<DeleteSurveyTemplateModal {...defaultProps} />);

      const deleteButton = screen.getByRole("button", { name: /^delete$/i });
      fireEvent.click(deleteButton);

      expect(mockMutate).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe("Loading states", () => {
    beforeEach(() => {
      vi.mocked(useDeleteSurveyTemplate).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      } as any);
    });

    it("shows loading state when deleting", () => {
      render(<DeleteSurveyTemplateModal {...defaultProps} />);

      expect(screen.getByText("Deleting...")).toBeInTheDocument();
      expect(screen.getByLabelText("Deleting survey...")).toBeInTheDocument();

      const deleteButton = screen.getByRole("button", { name: /deleting/i });
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveAttribute("aria-disabled", "true");

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      expect(cancelButton).toBeDisabled();
    });
  });

  describe("Success handling", () => {
    it("closes modal and navigates on successful deletion", async () => {
      let onSuccessCallback: (() => void) | undefined;

      vi.mocked(useDeleteSurveyTemplate).mockImplementation((options: any) => {
        onSuccessCallback = options.onSuccess;
        return {
          mutate: vi.fn().mockImplementation(() => {
            onSuccessCallback?.();
          }),
          isPending: false,
        } as any;
      });

      render(<DeleteSurveyTemplateModal {...defaultProps} />);

      const deleteButton = screen.getByRole("button", { name: /^delete$/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
        expect(mockPush).toHaveBeenCalledWith("/portal/feedback/");
      });
    });
  });
});
