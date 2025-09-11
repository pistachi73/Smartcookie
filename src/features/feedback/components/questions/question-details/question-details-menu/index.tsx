import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  MessageEdit01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useRouter } from "next/navigation";

import { Menu } from "@/shared/components/ui/menu";

import { QuestionDetailsMenuTrigger } from "./question-details-menu-trigger";

type QuestionDetailsMenuProps = {
  editHref: string;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const QuestionDetailsMenu = ({
  editHref,
  setShowDeleteModal,
}: QuestionDetailsMenuProps) => {
  const router = useRouter();
  return (
    <Menu>
      <QuestionDetailsMenuTrigger />
      <Menu.Content placement="bottom end">
        <Menu.Item
          onAction={() => {
            router.push(editHref);
          }}
        >
          <HugeiconsIcon icon={MessageEdit01Icon} size={16} data-slot="icon" />
          Edit
        </Menu.Item>
        <Menu.Item isDanger onAction={() => setShowDeleteModal(true)}>
          <HugeiconsIcon icon={Delete02Icon} size={16} data-slot="icon" />
          Delete
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};
