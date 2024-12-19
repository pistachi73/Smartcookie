export const HoursColumn = () => {
  return (
    <div className="mr-2 h-auto w-12">
      {Array.from({ length: 24 }).map((_, index) => {
        return (
          <div
            key={`hour-${index}`}
            className="h-16 flex items-center justify-center relative"
          >
            <span className="text-sm text-text-sub absolute top-[-10px] right-0">
              {index === 0 ? "" : `${String(index).padStart(2, "0")}:00`}
            </span>
          </div>
        );
      })}
    </div>
  );
};
