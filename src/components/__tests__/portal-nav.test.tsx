import { render } from "@testing-library/react";
import { Test } from "../portal/portal-nav";

describe("PortalNav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with default props", () => {
    render(<Test />);
  });
});
