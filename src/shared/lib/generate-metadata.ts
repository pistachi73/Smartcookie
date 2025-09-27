import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { currentUser } from "./auth";

type MetadataNamespace =
  | "Metadata.Dashboard"
  | "Metadata.Calendar"
  | "Metadata.QuickNotes"
  | "Metadata.Feedback"
  | "Metadata.Courses"
  | "Metadata.NewCourse"
  | "Metadata.EditCourse"
  | "Metadata.Students"
  | "Metadata.Subscription"
  | "Metadata.Account"
  | "Metadata.Survey";

export const generatePortalMetadata = async <T extends MetadataNamespace>({
  namespace,
  locale = "en-GB",
}: {
  namespace: T;
  locale?: Locale;
}): Promise<Metadata> => {
  const user = await currentUser();

  const t = (await getTranslations({
    namespace,
    locale,
  })) as any;

  return {
    title: t("title", { name: user?.name ? `- ${user?.name}` : "" }),
    description: t("description"),
  };
};
