import { cleanup, render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { PortalNav, type PortalNavProps } from "../portal/portal-nav";
import { SidebarProvider } from "../ui";

// Mock the next/navigation hooks
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("@/utils/use-media-query", () => ({
  useMediaQuery: vi.fn().mockReturnValue(false),
}));

// Mock the sidebar hook and provider

vi.mock("@/components/auth/user-button", () => ({
  UserButton: () => (
    <button type="button" aria-label="user">
      User
    </button>
  ),
}));

// Mock UI components

const renderPortalNav = (props?: PortalNavProps) => {
  return render(<PortalNav {...props} />, { wrapper: SidebarProvider });
};

describe("PortalNav", () => {
  // Setup default mocks
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue("/portal/dashboard");
  });

  // Clean up after each test
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test("renders with default props", () => {
    renderPortalNav();

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByLabelText("Search...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /user/i })).toBeInTheDocument();
  });

  test("renders without search field when showSearchField is false", () => {
    renderPortalNav({ showSearchField: false });

    expect(screen.queryByLabelText("Search...")).not.toBeInTheDocument();
  });

  test("renders with custom actions", () => {
    const customAction = <button type="button">Custom Action</button>;
    renderPortalNav({ actions: customAction });

    expect(screen.getByText("Custom Action")).toBeInTheDocument();
  });

  test("renders with custom className", () => {
    const { container } = renderPortalNav({ className: "custom-class" });

    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("custom-class");
  });

  test("renders breadcrumbs based on pathname", () => {
    renderPortalNav();

    expect(screen.getByRole("link", { name: "Portal" })).toHaveAttribute(
      "href",
      "/portal",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/portal/dashboard",
    );
  });

  test("renders breadcrumbs for clients path", () => {
    vi.mocked(usePathname).mockReturnValue("/portal/clients");
    renderPortalNav();

    expect(screen.getByRole("link", { name: "Portal" })).toHaveAttribute(
      "href",
      "/portal",
    );
    expect(screen.getByRole("link", { name: "Clients" })).toHaveAttribute(
      "href",
      "/portal/clients",
    );
  });

  test("renders breadcrumbs for nested clients path", () => {
    vi.mocked(usePathname).mockReturnValue("/portal/clients/123");
    renderPortalNav();

    expect(screen.getByRole("link", { name: "Portal" })).toHaveAttribute(
      "href",
      "/portal",
    );
    expect(screen.getByRole("link", { name: "Clients" })).toHaveAttribute(
      "href",
      "/portal/clients",
    );
    expect(screen.getByRole("link", { name: "123" })).toHaveAttribute(
      "href",
      "/portal/clients/123",
    );
  });

  test("renders breadcrumbs for settings path", () => {
    vi.mocked(usePathname).mockReturnValue("/portal/settings");
    renderPortalNav();

    expect(screen.getByRole("link", { name: "Portal" })).toHaveAttribute(
      "href",
      "/portal",
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/portal/settings",
    );
  });

  test("renders breadcrumbs for nested settings path", () => {
    vi.mocked(usePathname).mockReturnValue("/portal/settings/profile");
    renderPortalNav();

    expect(screen.getByRole("link", { name: "Portal" })).toHaveAttribute(
      "href",
      "/portal",
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/portal/settings",
    );
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "href",
      "/portal/settings/profile",
    );
  });

  test("renders with sidebar trigger", () => {
    renderPortalNav();

    const sidebarTrigger = screen.getByLabelText("Toggle Sidebar");
    expect(sidebarTrigger).toBeInTheDocument();
  });
});
