import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  User02Icon,
} from "@hugeicons-pro/core-stroke-rounded";

import { buttonStyles } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Link } from "@/shared/components/ui/link";

import { StudentProfileLayout } from "./student-profile-layout";

export const StudentNotFound = () => {
  return (
    <StudentProfileLayout>
      <EmptyState
        title="Student not found"
        description="The student you are looking for does not exist."
        className="bg-white"
        icon={User02Icon}
        action={
          <Link
            href="/portal/students"
            className={buttonStyles({ intent: "secondary" })}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} data-slot="icon" />
            Back to students
          </Link>
        }
      />
    </StudentProfileLayout>
  );
};
