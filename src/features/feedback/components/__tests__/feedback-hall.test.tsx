import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FeedbackHall } from "../feedback-hall";

vi.mock("@/shared/hooks/use-navigate-with-params", () => ({
  useNavigateWithParams: vi.fn(() => ({
    createHrefWithParams: vi.fn((path) => path),
  })),
}));

describe("FeedbackHall", () => {
  it("renders the expected content", () => {
    render(<FeedbackHall />);

    expect(
      screen.getByRole("heading", { name: /feedback hall/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Select a question or survey from the list, or create a new one with the options below./i,
      ),
    ).toBeInTheDocument();

    const createQuestionLink = screen.getByRole("link", {
      name: /create question/i,
    });
    expect(createQuestionLink).toBeInTheDocument();
    expect(createQuestionLink).toHaveAttribute(
      "href",
      "/portal/feedback/questions/new",
    );

    const createSurveyLink = screen.getByRole("link", {
      name: /create survey/i,
    });
    expect(createSurveyLink).toBeInTheDocument();
    expect(createSurveyLink).toHaveAttribute(
      "href",
      "/portal/feedback/survey-templates/new",
    );
  });
});
