import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createMockSearchParams,
  mockNextNavigation,
} from "@/shared/lib/testing/navigation-mocks";

import { FeedbackSidebar } from "../feedback-sidebar";

mockNextNavigation();

vi.mock("../questions/questions-panel", () => ({
  QuestionsPanel: () => (
    <div data-testid="questions-panel">Questions Panel</div>
  ),
}));

vi.mock("../survey-templates/survey-template-panel", () => ({
  SurveyTemplatesPanel: () => (
    <div data-testid="survey-templates-panel">Survey Templates Panel</div>
  ),
}));

describe("FeedbackSidebar", () => {
  const mockPush = vi.fn();
  const mockPathname = "/portal/feedback";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    vi.mocked(usePathname).mockReturnValue(mockPathname);
    vi.mocked(useSearchParams).mockReturnValue(createMockSearchParams() as any);
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders sidebar with tabs", () => {
    render(<FeedbackSidebar />);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /questions/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /templates/i })).toBeInTheDocument();
  });

  describe("Tab Selection and Panel Content", () => {
    it("shows questions tab and panel by default", () => {
      render(<FeedbackSidebar />);

      const questionsTab = screen.getByRole("tab", { name: /questions/i });
      expect(questionsTab).toHaveAttribute("aria-selected", "true");
      expect(screen.getByTestId("questions-panel")).toBeInTheDocument();
      expect(
        screen.queryByTestId("survey-templates-panel"),
      ).not.toBeInTheDocument();
    });

    it("shows surveys tab and panel when tab param is surveys", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        createMockSearchParams({ tab: "surveys" }) as any,
      );

      render(<FeedbackSidebar />);

      const surveysTab = screen.getByRole("tab", { name: /templates/i });
      expect(surveysTab).toHaveAttribute("aria-selected", "true");
      expect(screen.getByTestId("survey-templates-panel")).toBeInTheDocument();
      expect(screen.queryByTestId("questions-panel")).not.toBeInTheDocument();
    });

    it("handles missing tab parameter by defaulting to questions", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        createMockSearchParams() as any,
      );

      render(<FeedbackSidebar />);

      const questionsTab = screen.getByRole("tab", { name: /questions/i });
      expect(questionsTab).toHaveAttribute("aria-selected", "true");
      expect(screen.getByTestId("questions-panel")).toBeInTheDocument();
    });
  });

  describe("Tab Navigation", () => {
    it("navigates between tabs and clears search params", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        createMockSearchParams({
          tab: "questions",
          page: "2",
          q: "search",
        }) as any,
      );

      render(<FeedbackSidebar />);

      const surveysTab = screen.getByRole("tab", { name: /templates/i });
      fireEvent.click(surveysTab);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("tab=surveys"),
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.not.stringContaining("page="),
      );
      expect(mockPush).toHaveBeenCalledWith(expect.not.stringContaining("q="));
    });

    it("navigates from surveys back to questions tab", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        createMockSearchParams({ tab: "surveys" }) as any,
      );

      render(<FeedbackSidebar />);

      const questionsTab = screen.getByRole("tab", { name: /questions/i });
      fireEvent.click(questionsTab);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("tab=questions"),
      );
    });

    it("redirects to questions tab when invalid tab is provided", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        createMockSearchParams({ tab: "invalid" }) as any,
      );

      render(<FeedbackSidebar />);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("tab=questions"),
      );
    });
  });
});
