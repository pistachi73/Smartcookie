import { QuickNotes } from "@/components/portal/quick-notes/quick-notes";
import { db } from "@/db";
import { hub } from "@/db/schema";
import { currentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Quick Notes | Private Tutoring Manager",
  description: "Manage your quick notes for courses and general information",
};

export default async function QuickNotesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const hubs = await db.query.hub.findMany({
    where: eq(hub.userId, user.id),
    orderBy: (hubs) => [hubs.name],
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 pb-0">
        <h1 className="text-2xl font-bold">Quick Notes</h1>
      </div>
      <QuickNotes initialHubs={hubs} />
    </div>
  );
}
