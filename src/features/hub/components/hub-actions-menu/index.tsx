import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, Edit02Icon } from "@hugeicons-pro/core-stroke-rounded";

import { Menu } from "@/shared/components/ui/menu";

import { useRouter } from "@/i18n/navigation";
import { HubActionsMenuTrigger } from "./hub-actions-meny-trigger";

type HubActionsMenuProps = {
  editHref: string;
  onDelete?: () => void;
};

export const HubActionsMenu = ({ editHref, onDelete }: HubActionsMenuProps) => {
  const router = useRouter();
  return (
    <Menu>
      <HubActionsMenuTrigger />
      <Menu.Content placement="bottom left">
        <Menu.Item
          onAction={() => {
            router.push(editHref);
          }}
        >
          <HugeiconsIcon icon={Edit02Icon} size={16} data-slot="icon" />
          Edit
        </Menu.Item>
        <Menu.Item isDanger onAction={onDelete}>
          <HugeiconsIcon icon={Delete01Icon} size={16} data-slot="icon" />
          Delete
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};
