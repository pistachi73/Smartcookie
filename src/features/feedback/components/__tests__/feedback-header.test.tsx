import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FeedbackHeader } from "../feedback-header";

vi.mock("@/shared/hooks/use-navigate-with-params");

describe("FeedbackHeader", () => {
  const mockCreateHrefWithParams = vi.fn();
  beforeEach(() => {
    vi.mocked(useNavigateWithParams).mockReturnValue({
      createHrefWithParams: mockCreateHrefWithParams,
    });
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the page header with correct title and subtitle", () => {
    render(<FeedbackHeader />);

    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByText("Manage your feedback")).toBeInTheDocument();
  });

  it("renders create question and create survey buttons", () => {
    render(<FeedbackHeader />);

    expect(screen.getByText("Create Question")).toBeInTheDocument();
    expect(screen.getByText("Create Survey")).toBeInTheDocument();

    expect(mockCreateHrefWithParams).toHaveBeenCalledWith(
      "/portal/feedback/questions/new",
    );
    expect(mockCreateHrefWithParams).toHaveBeenCalledWith(
      "/portal/feedback/surveys/new",
    );

    expect(mockCreateHrefWithParams).toHaveBeenCalledTimes(2);
  });
});
