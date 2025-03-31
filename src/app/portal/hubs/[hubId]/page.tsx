"use client";

import { HubNotesStack } from "@/features/notes/components/hub-notes-stack";

const HubPage = () => {
  return (
    <div>
      <HubNotesStack
        hub={{
          id: 1,
          name: "Hub 1",
          color: "blueberry",
        }}
      />
    </div>
  );
};

export default HubPage;
