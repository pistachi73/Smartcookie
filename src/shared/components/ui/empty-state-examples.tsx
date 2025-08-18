import { Add01Icon, ArrowLeft02Icon } from "@hugeicons-pro/core-solid-rounded";

import { EmptyState } from "./empty-state";

/**
 * Examples of how to use the EmptyState component in different scenarios
 */

// Example 1: No sessions in a hub (with button action)
export const NoSessionsExample = () => (
  <EmptyState
    title="No sessions found"
    description="This hub doesn't have any sessions yet. Create your first session to get started."
    icon="calendar"
    action={{
      type: "button",
      label: "Create session",
      onClick: () => console.log("Create session clicked"),
      icon: Add01Icon,
      intent: "primary",
    }}
  />
);

// Example 2: No feedback surveys for a hub (with link action)
export const NoFeedbackSurveysExample = () => (
  <EmptyState
    title="No feedback surveys"
    description="There are no feedback surveys available for this hub yet."
    icon="comment"
    action={{
      type: "link",
      label: "Create survey",
      href: "/create-survey",
      icon: Add01Icon,
    }}
  />
);

// Example 3: No students in a hub (with button action)
export const NoStudentsExample = () => (
  <EmptyState
    title="No students enrolled"
    description="This hub doesn't have any students yet. Add students to start tracking attendance and progress."
    icon="users"
    action={{
      type: "button",
      label: "Add students",
      onClick: () => console.log("Add students clicked"),
      icon: Add01Icon,
      intent: "secondary",
    }}
  />
);

// Example 4: No quick notes (with button action)
export const NoQuickNotesExample = () => (
  <EmptyState
    title="No quick notes"
    description="You haven't created any quick notes yet. Start jotting down your thoughts and ideas."
    icon="note"
    action={{
      type: "button",
      label: "Create note",
      onClick: () => console.log("Create note clicked"),
      icon: Add01Icon,
      size: "medium",
    }}
  />
);

// Example 5: No data with back navigation
export const NoDataWithBackExample = () => (
  <EmptyState
    title="No data available"
    description="The requested data could not be found or is not available."
    icon="search"
    backLink={{
      label: "Go back",
      href: "/dashboard",
      icon: ArrowLeft02Icon,
    }}
  />
);

// Example 6: Custom icon and styling (with button action)
export const CustomEmptyStateExample = () => (
  <EmptyState
    title="Custom empty state"
    description="This is an example with custom styling and height."
    icon="custom"
    customIcon={Add01Icon}
    className="bg-secondary/50 rounded-lg p-8"
    minHeight="min-h-[300px]"
    action={{
      type: "button",
      label: "Learn more",
      onClick: () => console.log("Learn more clicked"),
      intent: "plain",
      size: "small",
    }}
  />
);

// Example 7: No search results (with link action)
export const NoSearchResultsExample = () => (
  <EmptyState
    title="No results found"
    description="Try adjusting your search terms or browse our categories instead."
    icon="search"
    action={{
      type: "link",
      label: "Browse all",
      href: "/browse",
    }}
  />
);

// Example 8: Empty folder (with button action)
export const EmptyFolderExample = () => (
  <EmptyState
    title="This folder is empty"
    description="Upload files or create new documents to get started."
    icon="folder"
    action={{
      type: "button",
      label: "Upload files",
      onClick: () => console.log("Upload files clicked"),
      icon: Add01Icon,
      intent: "primary",
      size: "large",
    }}
  />
);

// Example 9: No data with both action types comparison
export const ActionTypesComparisonExample = () => (
  <div className="space-y-8">
    <EmptyState
      title="Link Action Example"
      description="This uses a link action that navigates to another page."
      icon="search"
      action={{
        type: "link",
        label: "Go to help page",
        href: "/help",
        icon: Add01Icon,
      }}
    />

    <EmptyState
      title="Button Action Example"
      description="This uses a button action that triggers a function."
      icon="search"
      action={{
        type: "button",
        label: "Refresh data",
        onClick: () => window.location.reload(),
        icon: Add01Icon,
        intent: "secondary",
        size: "medium",
      }}
    />
  </div>
);
