import { useDroppable } from "@dnd-kit/core";
import SubscriberCard from "./SubscriberCard";

function KanbanColumn({ id, title, count, subscribers, onView }) {
    const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg w-72 flex-shrink-0 flex flex-col max-h-full transition-colors ${
        isOver ? "bg-blue-50" : "bg-gray-50"
      }`}
    >
      <div className="px-3 py-3 flex items-center justify-between border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {subscribers.length === 0 ? (
          <div className="text-center text-xs text-gray-400 py-8">
            No subscribers
          </div>
        ) : (
          subscribers.map((subscriber) => (
          <SubscriberCard key={subscriber._id} subscriber={subscriber} onView={onView} />
          ))
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;