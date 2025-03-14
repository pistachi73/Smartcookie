import { HubStackList } from "./hub-stack-list";
import QuickNotesNav from "./quick-notes-nav";
import { QuickNotesSidebar } from "./quick-notes-sidebar/index";

export const QuickNotes = () => {
  return (
    <div className="h-full w-full flex relative flex-col overflow-hidden">
      <QuickNotesNav />
      <div className="min-h-0 h-full flex bg-overlay w-full overflow-hidden">
        <QuickNotesSidebar />
        <HubStackList />
      </div>
    </div>
  );
};
