import type { Metadata } from "next";

import { generatePortalMetadata } from "@/shared/lib/generate-metadata";

import { Calendar } from "@/features/calendar/components";
import { CalendarStoreProvider } from "@/features/calendar/providers/calendar-store-provider";

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePortalMetadata({ namespace: "Metadata.Calendar" });
};

const CalendarPage = () => {
  return (
    <CalendarStoreProvider>
      <Calendar />
    </CalendarStoreProvider>
  );
};

export default CalendarPage;
