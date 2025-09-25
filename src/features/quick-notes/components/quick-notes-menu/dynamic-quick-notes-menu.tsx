import dynamic from "next/dynamic";

export const DynamicQuickNotesMenu = dynamic(() =>
  import("./index").then((mod) => mod.QuickNotesMenu),
);
