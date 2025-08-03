import { useRouter } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";

import { useCreateQuestion } from "../../../hooks/questions/use-create-question";
import { CreateQuestion } from "../create-question";

vi.mock("@/shared/hooks/use-navigate-with-params");

vi.mock("../../../hooks/questions/use-create-question", () => ({
  useCreateQuestion: vi.fn(),
}));

describe("CreateQuestion", () => {
  const mockPush = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);

    vi.mocked(useCreateQuestion).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the create question page with correct elements", () => {
    render(<CreateQuestion />);

    expect(
      screen.getByRole("heading", { name: /create question/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Create a question to collect feedback from your users.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back/i })).toBeInTheDocument();

    // Check for form elements
    expect(screen.getByLabelText(/question title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/question type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/allow additional comments/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create question/i }),
    ).toBeInTheDocument();
  });

  it("handles form submission with valid data", async () => {
    render(<CreateQuestion />);

    // Fill out the form
    const titleInput = screen.getByLabelText(/question title/i);
    fireEvent.change(titleInput, { target: { value: "Test Question" } });

    // Select question type (Text is default, but let's be explicit)
    const textOption = screen.getByRole("radio", { name: /text/i });
    fireEvent.click(textOption);

    // Add description
    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });

    // Toggle additional comments
    const additionalCommentsCheckbox = screen.getByLabelText(
      /allow additional comments/i,
    );
    fireEvent.click(additionalCommentsCheckbox);

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /create question/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        title: "Test Question",
        questionType: "text",
        description: "Test Description",
        enableAdditionalComment: true,
      });
    });
  });

  it("shows validation errors for empty required fields", async () => {
    render(<CreateQuestion />);

    const submitButton = screen.getByRole("button", {
      name: /create question/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows loading state when creating question", () => {
    vi.mocked(useCreateQuestion).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    render(<CreateQuestion />);

    const submitButton = screen.getByRole("button", { name: /creating/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("aria-disabled", "true");
  });

  it("navigates back on successful creation", async () => {
    // Variable to capture the actual onSuccess callback passed to the hook
    let onSuccessCallback: (() => void) | undefined;

    // Mock the hook implementation to intercept the options passed to it
    vi.mocked(useCreateQuestion).mockImplementation((options: any) => {
      // Capture the onSuccess callback from the component
      onSuccessCallback = options.onSuccess;
      return {
        // Mock mutate to immediately trigger the success callback when called
        mutate: vi.fn().mockImplementation(() => {
          onSuccessCallback?.();
        }),
        isPending: false,
      } as any;
    });

    render(<CreateQuestion />);

    const titleInput = screen.getByLabelText(/question title/i);
    fireEvent.change(titleInput, { target: { value: "Test Question" } });

    const submitButton = screen.getByRole("button", {
      name: /create question/i,
    });
    // When form is submitted → mutate is called → onSuccessCallback executes → router.push is called
    fireEvent.click(submitButton);

    // Verify that the component's onSuccess callback triggered navigation
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("/portal/feedback"),
      );
    });
  });

  it("uses correct mutation hook configuration", () => {
    render(<CreateQuestion />);

    expect(useCreateQuestion).toHaveBeenCalledWith({
      onSuccess: expect.any(Function),
    });
  });

  it("renders with proper heading hierarchy", () => {
    render(<CreateQuestion />);

    const heading = screen.getByRole("heading", { name: /create question/i });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H2");
  });

  it("handles form submission with minimal required data", async () => {
    render(<CreateQuestion />);

    const titleInput = screen.getByLabelText(/question title/i);
    fireEvent.change(titleInput, { target: { value: "Minimal Question" } });

    const submitButton = screen.getByRole("button", {
      name: /create question/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        title: "Minimal Question",
        questionType: "text",
        description: "",
        enableAdditionalComment: false,
      });
    });
  });
});
