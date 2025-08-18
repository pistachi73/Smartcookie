import { Add01Icon } from "@hugeicons-pro/core-solid-rounded";
import { vi } from "vitest";

import { fireEvent, render, screen } from "@/shared/lib/testing/test-utils";

import { EmptyState } from "../empty-state";

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: ({
    icon: Icon,
    size,
    className,
    "data-slot": dataSlot,
  }: any) => (
    <div
      data-testid="hugeicons-icon"
      data-icon={Icon.name}
      data-size={size}
      data-class={className}
      data-slot={dataSlot}
    >
      <Icon />
    </div>
  ),
}));

vi.mock("@hugeicons-pro/core-solid-rounded", () => ({
  SearchIcon: () => <div data-testid="search-icon">Search</div>,
  FolderLibraryIcon: () => <div data-testid="folder-icon">Folder</div>,
  Calendar03Icon: () => <div data-testid="calendar-icon">Calendar</div>,
  Comment01Icon: () => <div data-testid="comment-icon">Comment</div>,
  NoteIcon: () => <div data-testid="note-icon">Note</div>,
  UserGroupIcon: () => <div data-testid="users-icon">Users</div>,
  Add01Icon: () => <div data-testid="add-icon">Add</div>,
}));

describe("EmptyState", () => {
  it("renders with default props", () => {
    render(
      <EmptyState
        title="No data found"
        description="There are no items to display"
      />,
    );

    expect(screen.getByText("No data found")).toBeInTheDocument();
    expect(
      screen.getByText("There are no items to display"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    render(
      <EmptyState
        title="No data found"
        description="There are no items to display"
        icon="folder"
      />,
    );

    expect(screen.getByTestId("folder-icon")).toBeInTheDocument();
  });

  it("renders with custom icon component", () => {
    render(
      <EmptyState
        title="No data found"
        description="There are no items to display"
        icon="custom"
        customIcon={Add01Icon}
      />,
    );

    expect(screen.getByTestId("add-icon")).toBeInTheDocument();
  });

  it("renders with link action", () => {
    render(
      <EmptyState
        title="No data found"
        description="There are no items to display"
        action={{
          type: "link",
          label: "Create new item",
          href: "/create",
          icon: Add01Icon,
        }}
      />,
    );

    const actionLink = screen.getByText("Create new item");
    expect(actionLink).toBeInTheDocument();
    expect(actionLink.closest("a")).toHaveAttribute("href", "/create");
  });

  it("renders with button action", () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        title="No data found"
        description="There are no items to display"
        action={{
          type: "button",
          label: "Create new item",
          onClick: handleClick,
          icon: Add01Icon,
          intent: "secondary",
          size: "medium",
        }}
      />,
    );

    const actionButton = screen.getByText("Create new item");
    expect(actionButton).toBeInTheDocument();
    expect(actionButton.closest("button")).toBeInTheDocument();

    fireEvent.click(actionButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders button action with default props", () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        title="No data found"
        description="There are no items to display"
        action={{
          type: "button",
          label: "Create new item",
          onClick: handleClick,
        }}
      />,
    );

    const actionButton = screen.getByText("Create new item");
    expect(actionButton).toBeInTheDocument();

    // Check default button props
    const button = actionButton.closest("button");
    expect(button).toBeInTheDocument();
  });

  it("renders with back link", () => {
    render(
      <EmptyState
        title="No data found"
        description="There are no items to display"
        backLink={{
          label: "Back to dashboard",
          href: "/dashboard",
          icon: Add01Icon,
        }}
      />,
    );

    const backLink = screen.getByText("Back to dashboard");
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest("a")).toHaveAttribute("href", "/dashboard");
  });

  it("renders with custom className", () => {
    render(
      <EmptyState
        title="No data found"
        description="There are no items to display"
        className="custom-class"
      />,
    );

    const container = screen
      .getByText("No data found")
      .closest("div")?.parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("renders with custom minHeight", () => {
    render(
      <EmptyState
        title="No data found"
        description="There are no items to display"
        minHeight="min-h-[600px]"
      />,
    );

    const contentContainer = screen
      .getByText("No data found")
      .closest("div")?.parentElement;
    expect(contentContainer).toHaveClass("min-h-[600px]");
  });

  it("renders all icon variants correctly", () => {
    const { rerender } = render(
      <EmptyState title="Test" description="Test description" icon="search" />,
    );
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();

    rerender(
      <EmptyState title="Test" description="Test description" icon="folder" />,
    );
    expect(screen.getByTestId("folder-icon")).toBeInTheDocument();

    rerender(
      <EmptyState
        title="Test"
        description="Test description"
        icon="calendar"
      />,
    );
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();

    rerender(
      <EmptyState title="Test" description="Test description" icon="comment" />,
    );
    expect(screen.getByTestId("comment-icon")).toBeInTheDocument();

    rerender(
      <EmptyState title="Test" description="Test description" icon="note" />,
    );
    expect(screen.getByTestId("note-icon")).toBeInTheDocument();

    rerender(
      <EmptyState title="Test" description="Test description" icon="users" />,
    );
    expect(screen.getByTestId("users-icon")).toBeInTheDocument();
  });

  it("renders with both action and back link", () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        title="No data found"
        description="There are no items to display"
        action={{
          type: "button",
          label: "Create new item",
          onClick: handleClick,
        }}
        backLink={{
          label: "Back to dashboard",
          href: "/dashboard",
        }}
      />,
    );

    expect(screen.getByText("Create new item")).toBeInTheDocument();
    expect(screen.getByText("Back to dashboard")).toBeInTheDocument();
  });

  it("renders with both link and button actions in different instances", () => {
    const { rerender } = render(
      <EmptyState
        title="Link action example"
        description="This uses a link action"
        action={{
          type: "link",
          label: "Go to page",
          href: "/page",
        }}
      />,
    );

    expect(screen.getByText("Go to page")).toBeInTheDocument();
    expect(screen.getByText("Go to page").closest("a")).toHaveAttribute(
      "href",
      "/page",
    );

    rerender(
      <EmptyState
        title="Button action example"
        description="This uses a button action"
        action={{
          type: "button",
          label: "Click me",
          onClick: () => {},
        }}
      />,
    );

    expect(screen.getByText("Click me")).toBeInTheDocument();
    expect(screen.getByText("Click me").closest("button")).toBeInTheDocument();
  });
});
