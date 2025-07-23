import setMockViewport from "@/shared/components/layout/viewport-context/test-utils/setMockViewport";
import "@testing-library/jest-dom/vitest";
import { TextDecoder, TextEncoder } from "util";
import { vi } from "vitest";

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

// Auto-mock zustand
vi.mock("zustand");

setMockViewport("xl");

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  usePathname: vi.fn(),
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));
