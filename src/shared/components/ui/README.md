# UI Components

This directory contains reusable UI components that follow the design system and can be used across the application.

## EmptyState Component

The `EmptyState` component is a generic, reusable component for displaying empty states, no data scenarios, and not found situations throughout the application.

### Features

- **Flexible Icons**: Built-in icon options for common scenarios (search, folder, calendar, comment, note, users)
- **Custom Icons**: Support for custom icon components
- **Action Types**: Support for both link and button actions
- **Back Navigation**: Optional back links for navigation
- **Customizable Styling**: Custom CSS classes and minimum height
- **Consistent Design**: Follows the application's design system

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **Required** | The main heading text |
| `description` | `string` | **Required** | Descriptive text below the title |
| `icon` | `EmptyStateIcon` | `"search"` | Icon type to display |
| `customIcon` | `React.ComponentType` | `undefined` | Custom icon component (when `icon="custom"`) |
| `action` | `ActionType` | `undefined` | Optional action configuration (link or button) |
| `backLink` | `BackLink` | `undefined` | Optional back navigation link |
| `className` | `string` | `""` | Additional CSS classes |
| `minHeight` | `string` | `"min-h-[400px]"` | Minimum height for the content area |

### Icon Types

- `"search"` - Search icon (default)
- `"folder"` - Folder/library icon
- `"calendar"` - Calendar icon
- `"comment"` - Comment/feedback icon
- `"note"` - Note/document icon
- `"users"` - User group icon
- `"custom"` - Custom icon component

### Action Types

The `action` prop supports two types of actions:

#### Link Action
```tsx
action={{
  type: "link",
  label: "Create survey",
  href: "/create-survey",
  icon: Add01Icon, // optional
}}
```

#### Button Action
```tsx
action={{
  type: "button",
  label: "Create session",
  onClick: () => handleCreateSession(),
  icon: Add01Icon, // optional
  intent: "primary", // "primary" | "secondary" | "plain"
  size: "small", // "small" | "medium" | "large" | "square-petite" | "extra-small"
}}
```

### Usage Examples

#### Basic Usage
```tsx
<EmptyState
  title="No data found"
  description="There are no items to display"
/>
```

#### With Link Action
```tsx
<EmptyState
  title="No sessions found"
  description="This hub doesn't have any sessions yet."
  icon="calendar"
  action={{
    type: "link",
    label: "Create session",
    href: "/create-session",
    icon: Add01Icon,
  }}
/>
```

#### With Button Action
```tsx
<EmptyState
  title="No students enrolled"
  description="Add students to start tracking attendance."
  icon="users"
  action={{
    type: "button",
    label: "Add students",
    onClick: () => openAddStudentModal(),
    icon: Add01Icon,
    intent: "secondary",
    size: "medium",
  }}
/>
```

#### With Back Navigation
```tsx
<EmptyState
  title="Page not found"
  description="The requested page could not be found."
  icon="search"
  backLink={{
    label: "Go back",
    href: "/dashboard",
    icon: ArrowLeft02Icon,
  }}
/>
```

#### Custom Icon and Styling
```tsx
<EmptyState
  title="Custom empty state"
  description="With custom styling and icon."
  icon="custom"
  customIcon={CustomIcon}
  className="bg-secondary/50 rounded-lg p-8"
  minHeight="min-h-[300px]"
  action={{
    type: "button",
    label: "Learn more",
    onClick: () => showHelp(),
    intent: "plain",
    size: "small",
  }}
/>
```

### Common Use Cases

1. **No Data**: When lists, tables, or grids are empty
2. **Not Found**: When specific items cannot be found
3. **Empty States**: When users haven't created content yet
4. **Search Results**: When search queries return no results
5. **Error Recovery**: When data fails to load

### When to Use Each Action Type

- **Use Link Actions** when:
  - Navigating to another page
  - Opening external resources
  - Deep linking to specific content

- **Use Button Actions** when:
  - Triggering local functions
  - Opening modals or dialogs
  - Performing immediate actions
  - Form submissions

### Best Practices

- Use descriptive titles that clearly state what's missing
- Provide helpful descriptions that explain the situation
- Include action links when users can take action to resolve the empty state
- Use appropriate icons that match the context
- Keep descriptions concise but informative
- Consider the user's journey and provide clear next steps
- Choose the right action type based on the user's intent

### Migration from Existing Components

The `EmptyState` component can replace existing components like:
- `FeedbackNotFound`
- `SurveyNotFound`
- Custom empty state implementations

See `empty-state-examples.tsx` for migration examples and common patterns.
