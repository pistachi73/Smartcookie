import { vi } from "vitest";

import type { Viewport } from "../types";
import { createViewportHelpers } from "../utils";
import { useViewport } from "../viewport-context";

vi.mock("../viewport-context", async (importOriginal) => {
  return {
    __esModule: true,
    ...((await importOriginal()) as any),
    useViewport: vi.fn(),
  };
});

const setMockViewport = (viewport: Viewport) => {
  const returnValue = createViewportHelpers(viewport);
  vi.mocked(useViewport).mockReturnValue(returnValue);
};

export default setMockViewport;
