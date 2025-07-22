import { useParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";

import { SurveyTemplateListItem } from "../survey-template-list-item";

vi.mock("@/shared/hooks/use-navigate-with-params");

vi.mock("../delete-survey-template-modal", () => ({
  DeleteSurveyTemplateModal: ({ isOpen, surveyTemplate }: any) =>
    isOpen ? (
      <div data-testid="delete-modal">Delete {surveyTemplate.title}</div>
    ) : null,
}));

describe("SurveyListItem", () => {
  const mockSurvey = {
    id: 1,
    title: "Customer Satisfaction Survey",
    description: "Help us improve our services",
    totalResponses: 42,
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ surveyId: "1" });
  });

  afterEach(() => {
    cleanup();
  });

  describe("Basic rendering", () => {
    it("renders survey information correctly", () => {
      render(<SurveyTemplateListItem surveyTemplate={mockSurvey} />);

      expect(
        screen.getByText("Customer Satisfaction Survey"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Help us improve our services"),
      ).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders survey without description", () => {
      const surveyWithoutDescription = { ...mockSurvey, description: null };
      render(
        <SurveyTemplateListItem surveyTemplate={surveyWithoutDescription} />,
      );

      expect(
        screen.getByText("Customer Satisfaction Survey"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Help us improve our services"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Active state", () => {
    it("detects active survey correctly", () => {
      vi.mocked(useParams).mockReturnValue({ surveyId: "1" });
      render(<SurveyTemplateListItem surveyTemplate={mockSurvey} />);

      expect(screen.getByTestId("survey-list-item")).toHaveAttribute(
        "data-selected",
        "true",
      );
    });

    it("detects inactive survey correctly", () => {
      vi.mocked(useParams).mockReturnValue({ surveyId: "2" });
      render(<SurveyTemplateListItem surveyTemplate={mockSurvey} />);

      expect(screen.getByTestId("survey-list-item")).toHaveAttribute(
        "data-selected",
        "false",
      );
    });
  });

  it("creates view link", () => {
    render(<SurveyTemplateListItem surveyTemplate={mockSurvey} />);

    const viewLink = screen.getByRole("link");
    expect(viewLink).toHaveAttribute(
      "href",
      expect.stringContaining(
        `/portal/feedback/survey-templates/${mockSurvey.id}`,
      ),
    );
  });

  describe("Menu interactions", () => {
    it("shows menu button", () => {
      render(<SurveyTemplateListItem surveyTemplate={mockSurvey} />);

      const menuButton = screen.getByRole("button");
      expect(menuButton).toBeInTheDocument();

      fireEvent.click(menuButton);
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("has edit link in menu", () => {
      render(<SurveyTemplateListItem surveyTemplate={mockSurvey} />);

      const menuButton = screen.getByRole("button");
      fireEvent.click(menuButton);

      const editLink = screen.getByText("Edit").closest("a");
      expect(editLink).toHaveAttribute(
        "href",
        expect.stringContaining(
          `/portal/feedback/survey-templates/${mockSurvey.id}/edit`,
        ),
      );
    });

    it("opens delete modal when delete is clicked", () => {
      render(<SurveyTemplateListItem surveyTemplate={mockSurvey} />);

      const menuButton = screen.getByRole("button");
      fireEvent.click(menuButton);

      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);

      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
      expect(
        screen.getByText("Delete Customer Satisfaction Survey"),
      ).toBeInTheDocument();
    });
  });
});
