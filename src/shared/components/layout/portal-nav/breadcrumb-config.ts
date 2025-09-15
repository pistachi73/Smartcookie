import {
  Calendar01Icon as Calendar01IconSolid,
  CreditCardIcon as CreditCardIconSolid,
  FolderLibraryIcon as FolderLibraryIconSolid,
  HealtcareIcon as HealtcareIconSolid,
  Layout04Icon as Layout04IconSolid,
  NoteIcon as NoteIconSolid,
  User02Icon as User02IconSolid,
  UserGroupIcon as UserGroupIconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import {
  Calendar01Icon,
  CreditCardIcon,
  FolderLibraryIcon,
  HealtcareIcon,
  Layout04Icon,
  NoteIcon,
  User02Icon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-rounded";

export type BreadcrumbConfig =
  | {
      label: string;
      href: string;
      icon?: typeof User02Icon;
      iconSolid?: typeof User02Icon;
      dynamic?: boolean;
    }
  | "skeleton";

export interface RouteBreadcrumbConfig {
  [key: string]: BreadcrumbConfig[];
}

export const breadcrumbConfig: RouteBreadcrumbConfig = {
  "/portal/dashboard": [
    { label: "Portal", href: "/portal/dashboard" },
    {
      label: "Dashboard",
      href: "/portal/dashboard",
      icon: Layout04Icon,
      iconSolid: Layout04IconSolid,
    },
  ],
  "/portal/feedback": [
    { label: "Portal", href: "/portal/dashboard" },
    {
      label: "Feedback",
      href: "/portal/feedback",
      icon: HealtcareIcon,
      iconSolid: HealtcareIconSolid,
    },
  ],
  "/portal/calendar": [
    { label: "Portal", href: "/portal/dashboard" },
    {
      label: "Calendar",
      href: "/portal/calendar",
      icon: Calendar01Icon,
      iconSolid: Calendar01IconSolid,
    },
  ],
  "/portal/students": [
    { label: "Portal", href: "/portal/dashboard" },
    {
      label: "Students",
      href: "/portal/students",
      icon: UserGroupIcon,
      iconSolid: UserGroupIconSolid,
    },
  ],
  "/portal/hubs": [
    { label: "Portal", href: "/portal/dashboard" },
    {
      label: "Hubs",
      href: "/portal/hubs",
      icon: FolderLibraryIcon,
      iconSolid: FolderLibraryIconSolid,
    },
  ],
  "/portal/quick-notes": [
    { label: "Portal", href: "/portal/dashboard" },
    {
      label: "Quick Notes",
      href: "/portal/quick-notes",
      icon: NoteIcon,
      iconSolid: NoteIconSolid,
    },
  ],
  "/portal/account": [
    { label: "Portal", href: "/portal/dashboard" },
    {
      label: "Account",
      href: "/portal/account",
      icon: User02Icon,
      iconSolid: User02IconSolid,
    },
  ],
  "/portal/billing": [
    { label: "Portal", href: "/portal/dashboard" },
    {
      label: "Billing",
      href: "/portal/billing",
      icon: CreditCardIcon,
      iconSolid: CreditCardIconSolid,
    },
  ],
} as const;

// Cache for breadcrumb results to avoid repeated calculations
const breadcrumbCache = new Map<string, BreadcrumbConfig[]>();

// Utility to check if a segment is likely an ID (numeric or UUID-like)
function isIdSegment(segment: string): boolean {
  console.log("segment", segment);
  // Check for numeric IDs
  if (/^\d+$/.test(segment)) return true;
  // Check for UUID patterns
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      segment,
    )
  )
    return true;
  return false;
}

// Get a human-readable label for ID segments
function getIdSegmentLabel(segment: string, pathContext: string[]): string {
  // For numeric IDs, use a contextual label based on the parent route
  if (/^\d+$/.test(segment)) {
    const parentSegment =
      pathContext.length >= 2 ? pathContext[pathContext.length - 2] : undefined;
    switch (parentSegment) {
      case "hubs":
        return "Hub Details";
      case "students":
        return "Student Profile";
      case "questions":
        return "Question Details";
      case "survey-templates":
        return "Template Details";
      default:
        return "Details";
    }
  }

  // For UUIDs or other IDs, use a generic label
  return "Details";
}

// Transform segment to human-readable label
function formatSegmentLabel(segment: string, pathContext: string[]): string {
  // Handle ID segments

  if (isIdSegment(segment)) {
    return getIdSegmentLabel(segment, pathContext);
  }

  // Handle special cases
  if (segment === "new") return "New";
  if (segment === "edit") return "Edit";

  // Transform kebab-case to Title Case
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getBreadcrumbsForPath(
  pathnameWithLocale: string,
): BreadcrumbConfig[] {
  const pathname = `/${pathnameWithLocale.split("/").slice(2).join("/")}`;

  // Check cache first for performance
  if (breadcrumbCache.has(pathname)) {
    return breadcrumbCache.get(pathname)!;
  }

  // Try exact match first (most performant)
  if (breadcrumbConfig[pathname]) {
    const result = breadcrumbConfig[pathname];
    breadcrumbCache.set(pathname, result);
    return result;
  }

  // Handle calendar routes - always return just Portal -> Calendar
  if (pathname.startsWith("/portal/calendar")) {
    const result = breadcrumbConfig["/portal/calendar"] ?? [];
    breadcrumbCache.set(pathname, result);
    return result;
  }

  // Split path into segments for dynamic route handling
  const pathSegments = pathname.split("/").filter(Boolean);

  // Early return for non-portal routes
  if (pathSegments[0] !== "portal") {
    const fallback = [{ label: "Portal", href: "/portal" }];
    breadcrumbCache.set(pathname, fallback);
    return fallback;
  }

  // Find the longest matching parent route
  let baseBreadcrumbs: BreadcrumbConfig[] = [];
  let matchedSegmentCount = 0;

  // Start from the longest possible path and work backwards
  for (let i = pathSegments.length; i > 0; i--) {
    const testPath = `/${pathSegments.slice(0, i).join("/")}`;
    if (breadcrumbConfig[testPath]) {
      baseBreadcrumbs = breadcrumbConfig[testPath];
      matchedSegmentCount = i;
      break;
    }
  }

  // If no base match found, use portal fallback
  if (matchedSegmentCount === 0) {
    baseBreadcrumbs = [{ label: "Portal", href: "/portal" }];
    matchedSegmentCount = 1; // Skip "portal" segment
  }

  // Add breadcrumbs for remaining dynamic segments
  if (matchedSegmentCount < pathSegments.length) {
    const remainingSegments = pathSegments.slice(matchedSegmentCount);
    const additionalBreadcrumbs: BreadcrumbConfig[] = [];

    for (let i = 0; i < remainingSegments.length; i++) {
      const segment = remainingSegments[i];
      if (!segment) continue; // Skip empty segments

      const currentPathSegments = pathSegments.slice(
        0,
        matchedSegmentCount + i + 1,
      );
      const label = formatSegmentLabel(segment, currentPathSegments);
      const href = `/${currentPathSegments.join("/")}`;

      additionalBreadcrumbs.push({ label, href });
    }

    const result = [...baseBreadcrumbs, ...additionalBreadcrumbs];
    breadcrumbCache.set(pathname, result);
    return result;
  }

  // Cache and return base breadcrumbs
  breadcrumbCache.set(pathname, baseBreadcrumbs);
  return baseBreadcrumbs;
}
