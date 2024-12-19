const CalendarLayout = async ({
  children,
  sidebar,
}: { children: React.ReactNode; sidebar: React.ReactNode }) => {
  return (
    <div className="h-full flex gap-2">
      {children}
      {sidebar}
    </div>
  );
};

export default CalendarLayout;
