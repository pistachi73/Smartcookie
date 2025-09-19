import { getUserHubCountQueryOptions } from "@/shared/hooks/plan-limits/query-options/hub-count-query-options";
import { currentUser } from "@/shared/lib/auth";
import { getQueryClient } from "@/shared/lib/get-query-client";

import { getPlanLimits } from "@/core/config/plan-limits";
import { CreateHubForm } from "@/features/hub/components/create-hub-form";
import { redirect } from "@/i18n/navigation";

const NewHubPage = async (props: PageProps<"/[locale]/portal/hubs/new">) => {
  const queryClient = getQueryClient();

  const [user, { locale }, hubCount] = await Promise.all([
    currentUser(),
    props.params,
    queryClient.fetchQuery(getUserHubCountQueryOptions),
  ]);

  const limits = getPlanLimits(user?.subscriptionTier);

  if (limits.hubs.maxCount !== -1 && hubCount >= limits.hubs.maxCount) {
    return redirect({
      href: "/portal/hubs",
      locale,
    });
  }

  return <CreateHubForm />;
};

export default NewHubPage;
