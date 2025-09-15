import { useTranslations } from "next-intl";

export const useFreePricingPlanFeatures = () => {
  const t = useTranslations("Landing.Pricing.Free.features");

  return [
    {
      id: "courses-limit",
      label: t("coursesLimit"),
    },
    {
      id: "students-limit",
      label: t("studentsLimit"),
    },
    {
      id: "notes-limit",
      label: t("notesLimit"),
    },
    {
      id: "notes-character-limit",
      label: t("notesCharacterLimit"),
    },
    {
      id: "community-access",
      label: t("communityAccess"),
    },
  ];
};

export const useBasicPricingPlanFeatures = () => {
  const t = useTranslations("Landing.Pricing.Basic.features");

  return [
    {
      id: "courses-limit",
      label: t("coursesLimit"),
    },
    {
      id: "students-limit",
      label: t("studentsLimit"),
    },
    {
      id: "notes-limit",
      label: t("notesLimit"),
    },
    {
      id: "notes-character-limit",
      label: t("notesCharacterLimit"),
    },
    {
      id: "community-access",
      label: t("communityAccess"),
    },
    {
      id: "it-support",
      label: t("itSupport"),
    },
    {
      id: "feedback-progress-tracking",
      label: t("feedbackProgressTracking"),
    },
    {
      id: "automatic-schedule-conflict-notification",
      label: t("automaticScheduleConflictNotification"),
    },
  ];
};

export const usePremiumPricingPlanFeatures = () => {
  const t = useTranslations("Landing.Pricing.Premium.features");

  return [
    {
      id: "courses-limit",
      label: t("coursesLimit"),
    },
    {
      id: "students-limit",
      label: t("studentsLimit"),
    },
    {
      id: "notes-limit",
      label: t("notesLimit"),
    },
    {
      id: "notes-character-limit",
      label: t("notesCharacterLimit"),
    },
    {
      id: "community-access",
      label: t("communityAccess"),
    },
    {
      id: "it-support",
      label: t("itSupport"),
    },
  ];
};
