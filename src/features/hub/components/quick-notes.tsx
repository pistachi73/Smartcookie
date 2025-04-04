interface Note {
  content: string;
  date: string;
}

const mockNotes: Note[] = [
  {
    content:
      "Remember to create extra exercises for session 3 on responsive design.",
    date: "26/03/2025",
  },
];

export function QuickNotes() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Quick Notes</h2>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600"
          aria-label="Add note"
        >
          +
        </button>
      </div>

      <div className="space-y-4">
        {mockNotes.map((note, index) => (
          <div key={index} className="group relative">
            <p className="text-gray-600 text-sm">{note.content}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">{note.date}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Edit note"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600"
                  aria-label="Delete note"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
