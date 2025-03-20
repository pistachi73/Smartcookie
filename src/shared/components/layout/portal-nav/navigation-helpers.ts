/**
 * Navigation helpers for the portal layout
 */

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface NavigationPathDetails {
  breadcrumbs: BreadcrumbItem[];
  currentPath: string;
  title: string;
}

// Map of route segments to friendly names
const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  calendar: "Calendar",
  hubs: "Hubs",
  clients: "Clients",
  "quick-notes": "Quick Notes",
  billing: "Billing",
};

/**
 * Get navigation details for the current path
 */
export function getNavigationPathDetails(
  pathname: string,
): NavigationPathDetails {
  // Clean up path and get segments
  const pathWithoutLeadingSlash = pathname?.startsWith("/")
    ? pathname.slice(1)
    : pathname || "";
  const pathSegments = pathWithoutLeadingSlash.split("/").filter(Boolean);

  // Initialize breadcrumbs with Portal home
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Portal",
      href: "/portal",
    },
  ];

  let currentPath = "/portal";

  // Build breadcrumbs for each path segment
  pathSegments.forEach((segment) => {
    // Skip "portal" if it's the first segment (already added)
    if (segment === "portal" && currentPath === "/portal") {
      return;
    }

    // Add segment to current path
    currentPath += `/${segment}`;

    // Get friendly label or format the segment
    let label = ROUTE_LABELS[segment];
    if (!label) {
      // Capitalize first letter and replace hyphens with spaces
      label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    }

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  // Get page title from last breadcrumb or default to "Portal"
  const title =
    breadcrumbs.length > 1
      ? breadcrumbs[breadcrumbs.length - 1]!.label
      : "Portal";

  return {
    breadcrumbs,
    currentPath,
    title,
  };
}
