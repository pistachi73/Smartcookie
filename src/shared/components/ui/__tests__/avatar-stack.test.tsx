import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@/shared/lib/testing/test-utils";

import { AvatarStack, type User } from "../avatar-stack";

// Mock users for testing
const users: User[] = [
  { id: "1", name: "John Doe", image: "/john.jpg" },
  { id: "2", name: "Jane Smith", image: null },
  { id: "3", name: "Bob Johnson", image: "/bob.jpg", email: "bob@example.com" },
  { id: "4", name: "Alice Brown", image: null, email: "alice@example.com" },
  { id: "5", name: "Mike Wilson", image: "/mike.jpg" },
  { id: "6", name: "Sarah Lee", image: null },
];

vi.useFakeTimers();

describe("AvatarStack", () => {
  // Clean up after each test
  afterEach(() => {
    cleanup();
  });

  it("renders avatars for users", () => {
    const { container } = render(<AvatarStack users={users.slice(0, 3)} />);

    expect(
      container.querySelector('[data-testid="avatar-stack"]'),
    ).toBeInTheDocument();
  });

  it("limits the number of displayed avatars based on maxAvatars", async () => {
    const maxAvatars = 3;
    const overflowAvatars = users.slice(maxAvatars);
    render(<AvatarStack users={users} maxAvatars={maxAvatars} />);

    // Check that the overflow indicator with correct count is displayed
    const overflowAvatar = screen.getByTestId("overflow-avatar");
    expect(overflowAvatar).toBeInTheDocument();
    expect(overflowAvatar).toHaveTextContent(`+${overflowAvatars.length}`);
  });

  it("shows all avatars when users.length <= maxAvatars", () => {
    render(<AvatarStack users={users.slice(0, 3)} maxAvatars={5} />);
    const overflowAvatar = screen.queryByTestId("overflow-avatar");
    expect(overflowAvatar).not.toBeInTheDocument();
  });
});
