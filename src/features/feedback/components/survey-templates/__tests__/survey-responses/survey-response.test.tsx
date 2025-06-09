import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";
import { useQuery } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SurveyResponse } from "../../survey-responses/survey-response";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock("../../survey-responses/survey-response-answers", () => ({
  SurveyResponseAnswers: vi.fn(({ surveyResponseId, surveyTemplateId }) => (
    <div data-testid="survey-response-answers">
      Survey Response Answers - Response: {surveyResponseId}, Template:{" "}
      {surveyTemplateId}
    </div>
  )),
}));

const mockResponse = {
  id: 1,
  completedAt: "2024-01-15T14:30:00Z",
  startedAt: "2024-01-15T14:00:00Z",
  createdAt: "2024-01-15T13:30:00Z",
  student: {
    id: 101,
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://example.com/avatar.jpg",
  },
};

const defaultProps = {
  surveyTemplateId: 1,
  handleToggle: vi.fn(),
  isOpen: false,
  response: mockResponse,
};

describe("SurveyResponse", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQuery).mockReturnValue({
      isLoading: false,
      data: null,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  describe("Main Component Structure", () => {
    it("renders the expected content", () => {
      render(<SurveyResponse {...defaultProps} />);

      const toggleButton = screen.getByRole("button");
      expect(toggleButton).toBeInTheDocument();
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
      expect(screen.getByText("15 Jan 2024")).toBeInTheDocument();
      expect(screen.getByText("3:30 PM")).toBeInTheDocument();
    });
  });

  describe("Toggle Functionality", () => {
    it("calls handleToggle when button is clicked", () => {
      const mockHandleToggle = vi.fn();
      render(
        <SurveyResponse {...defaultProps} handleToggle={mockHandleToggle} />,
      );

      const toggleButton = screen.getByRole("button");
      fireEvent.click(toggleButton);

      expect(mockHandleToggle).toHaveBeenCalledTimes(1);
    });

    it("shows right arrow icon when closed", () => {
      render(<SurveyResponse {...defaultProps} isOpen={false} />);

      const toggleButton = screen.getByRole("button");
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("shows loading spinner when query is loading", () => {
      vi.mocked(useQuery).mockReturnValue({
        isLoading: true,
        data: null,
      } as any);

      render(<SurveyResponse {...defaultProps} isOpen={true} />);
      expect(screen.getByLabelText("Loading response")).toBeInTheDocument();
    });

    it("hides loading spinner when query is not loading", () => {
      vi.mocked(useQuery).mockReturnValue({
        isLoading: false,
        data: null,
      } as any);

      render(<SurveyResponse {...defaultProps} isOpen={true} />);

      expect(
        screen.queryByLabelText("Loading response"),
      ).not.toBeInTheDocument();
    });
  });

  describe("SurveyResponseAnswers Integration", () => {
    it("renders SurveyResponseAnswers when open and not loading", () => {
      vi.mocked(useQuery).mockReturnValue({
        isLoading: false,
        data: null,
      } as any);

      render(<SurveyResponse {...defaultProps} isOpen={true} />);

      expect(screen.getByTestId("survey-response-answers")).toBeInTheDocument();
      expect(
        screen.getByText("Survey Response Answers - Response: 1, Template: 1"),
      ).toBeInTheDocument();
    });

    it("does not render SurveyResponseAnswers when closed", () => {
      render(<SurveyResponse {...defaultProps} isOpen={false} />);

      expect(
        screen.queryByTestId("survey-response-answers"),
      ).not.toBeInTheDocument();
    });

    it("does not render SurveyResponseAnswers when loading", () => {
      vi.mocked(useQuery).mockReturnValue({
        isLoading: true,
        data: null,
      } as any);

      render(<SurveyResponse {...defaultProps} isOpen={true} />);

      expect(
        screen.queryByTestId("survey-response-answers"),
      ).not.toBeInTheDocument();
    });

    it("passes correct props to SurveyResponseAnswers", () => {
      render(
        <SurveyResponse
          {...defaultProps}
          surveyTemplateId={999}
          isOpen={true}
        />,
      );

      expect(
        screen.getByText(
          "Survey Response Answers - Response: 1, Template: 999",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Animation and Transitions", () => {
    it("renders expanded content when open", async () => {
      render(<SurveyResponse {...defaultProps} isOpen={true} />);

      await waitFor(() => {
        const expandedContent = screen.getByTestId("survey-response-answers");
        expect(expandedContent).toBeInTheDocument();
      });
    });
  });
});
