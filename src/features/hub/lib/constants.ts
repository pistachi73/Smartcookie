import {
  CalendarIcon as CalendarIconSolid,
  Comment01Icon as Comment01IconSolid,
  DashboardBrowsingIcon as DashboardBrowsingIconSolid,
  NoteIcon as NoteIconSolid,
  UserMultiple02Icon as UserMultiple02IconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import {
  CalendarIcon,
  Comment01Icon,
  DashboardBrowsingIcon,
  NoteIcon,
  UserMultiple02Icon,
} from "@hugeicons-pro/core-stroke-rounded";

export const TABS: {
  id: string;
  label: string;
  icon: typeof UserMultiple02Icon;
  altIcon: typeof UserMultiple02IconSolid;
}[] = [
  {
    id: "overview",
    icon: DashboardBrowsingIcon,
    altIcon: DashboardBrowsingIconSolid,
    label: "Overview",
  },
  {
    id: "students",
    icon: UserMultiple02Icon,
    altIcon: UserMultiple02IconSolid,
    label: "Students",
  },
  {
    id: "sessions",
    icon: CalendarIcon,
    altIcon: CalendarIconSolid,
    label: "Sessions",
  },
  {
    id: "feedback",
    icon: Comment01Icon,
    altIcon: Comment01IconSolid,
    label: "Feedback",
  },
  {
    id: "quick-notes",
    icon: NoteIcon,
    altIcon: NoteIconSolid,
    label: "Quick Notes",
  },
];
