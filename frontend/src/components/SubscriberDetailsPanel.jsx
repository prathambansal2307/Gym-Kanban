import { getDaysRemaining } from "../utils/statusUtils";

const statusOptions = [
  { key: "new", label: "New / Paid" },
  { key: "onboarding", label: "Onboarding" },
  { key: "active", label: "Active" },
  { key: "onhold", label: "On Hold / Frozen" },
  { key: "expiringsoon", label: "Expiring Soon" },
  { key: "renewaldue", label: "Renewal Due" },
  { key: "expired", label: "Expired" },
];

function SubscriberDetailsPanel({
  subscriber,
  pendingStatus,
  onStatusChange,
  onSave,
  onClose,
}) {
  if (!subscriber) return null;

  const daysRemaining = getDaysRemaining(subscriber.expiryDate);
  const hasChanges = pendingStatus !== subscriber.status;

  return (
    <div className="w-80 flex-shrink-0 bg-white border-l border-gray-200 h-[calc(100vh-140px)] overflow-y-auto p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">Subscriber Details</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600">
          {subscriber.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{subscriber.name}</p>
          <span className="inline-block text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded mt-1">
            {subscriber.status}
          </span>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-gray-400 text-xs">Membership Plan</p>
          <p className="text-gray-800">{subscriber.membershipPlan}</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Start Date</p>
          <p className="text-gray-800">{subscriber.startDate}</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Expiry Date</p>
          <p className="text-gray-800">{subscriber.expiryDate}</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Days Remaining</p>
          <p className={daysRemaining < 0 ? "text-red-600 font-medium" : "text-gray-800"}>
            {daysRemaining < 0
              ? `${Math.abs(daysRemaining)} days overdue`
              : `${daysRemaining} days`}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Phone</p>
          <p className="text-gray-800">{subscriber.phone || "—"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Email</p>
          <p className="text-gray-800">{subscriber.email}</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Trainer</p>
          <p className="text-gray-800">{subscriber.trainer || "—"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Notes</p>
          <p className="text-gray-800">{subscriber.notes || "—"}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-gray-400 text-xs mb-1">Change Status</p>
        <select
          value={pendingStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={onSave}
          disabled={!hasChanges}
          className={`w-full text-sm font-medium py-2 rounded-lg transition-colors ${
            hasChanges
              ? "bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>

        <button
          onClick={onClose}
          className="w-full text-sm font-medium py-2 mt-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default SubscriberDetailsPanel;