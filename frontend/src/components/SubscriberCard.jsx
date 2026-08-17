import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { getDaysRemaining } from "../utils/statusUtils";

function SubscriberCard({ subscriber, onView }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: subscriber._id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  const daysRemaining = getDaysRemaining(subscriber.expiryDate);
  const isExpired = daysRemaining < 0;
  const isExpiringSoon = daysRemaining >= 0 && daysRemaining <= 7;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
          {subscriber.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{subscriber.name}</p>
          <p className="text-xs text-gray-500">{subscriber.membershipPlan}</p>
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-0.5">
        <p>Start: {subscriber.startDate}</p>
        <p>Expiry: {subscriber.expiryDate}</p>
      </div>

      {isExpired && (
        <span className="inline-block mt-2 text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded">
          {Math.abs(daysRemaining)} days overdue
        </span>
      )}

      {isExpiringSoon && (
        <span className="inline-block mt-2 text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
          {daysRemaining} days left
        </span>
      )}

      <button
        onClick={(e) => {
        e.stopPropagation();
        onView(subscriber);
        }}
        className="mt-3 w-full text-xs font-medium text-blue-600 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-50 transition-colors"
      >
      View
      </button>
    </div>
  );
}

export default SubscriberCard;