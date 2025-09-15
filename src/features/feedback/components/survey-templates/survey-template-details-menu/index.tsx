import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  MessageEdit01Icon,
  Rocket01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import type React from "react";

import { Menu } from "@/shared/components/ui/menu";

import { useRouter } from "@/i18n/navigation";
import { SurveyTemplateDetailsMenuTrigger } from "./survey-template-details-menu-trigger";

type SurveyTemplateDetailsMenutProps = {
  editHref: string;
  setShowInitSurveySheet: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SurveyTemplateDetailsMenu = ({
  editHref,
  setShowInitSurveySheet,
  setShowDeleteModal,
}: SurveyTemplateDetailsMenutProps) => {
  const router = useRouter();
  return (
    <Menu>
      <SurveyTemplateDetailsMenuTrigger />
      <Menu.Content placement="bottom end" popover={{ showArrow: true }}>
        <Menu.Item
          onAction={() => {
            setShowInitSurveySheet(true);
          }}
        >
          <HugeiconsIcon icon={Rocket01Icon} size={16} data-slot="icon" />
          Initiate Survey
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item
          onAction={() => {
            router.push(editHref);
          }}
        >
          <HugeiconsIcon icon={MessageEdit01Icon} size={16} data-slot="icon" />
          Edit Template
        </Menu.Item>
        <Menu.Item isDanger onAction={() => setShowDeleteModal(true)}>
          <HugeiconsIcon icon={Delete02Icon} size={16} data-slot="icon" />
          Delete Template
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};
