import { useState, useEffect } from "react";
import { getPlans } from "../services/planService";
import { getTrainers } from "../services/trainerService";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  membershipPlan: "",
  startDate: "",
  expiryDate: "",
  trainer: "",
  notes: "",
};

function AddSubscriberModal({ onAdd, onClose }) {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");

  const [plans, setPlans] = useState([]);
  useEffect(() => {
    getPlans()
    .then(setPlans)
    .catch(() => setPlans([]));
}, []);

const [trainers, setTrainers] = useState([]);
  useEffect(() => {
    getTrainers()
    .then(setTrainers)
    .catch(() => setTrainers([]));
}, []);

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.membershipPlan) {
    setError("Name, email, and membership plan are required.");
    return;
  }

  if (!formData.startDate || !formData.expiryDate) {
    setError("Start date and expiry date are required.");
    return;
  }

  if (new Date(formData.expiryDate) <= new Date(formData.startDate)) {
    setError("Expiry date must be after the start date.");
    return;
  }

  try {
    await onAdd(formData);
  } catch (err) {
    setError("Failed to add subscriber. Please try again.");
  }
}

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Subscriber</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Membership Plan *</label>
            <select
                value={formData.membershipPlan}
                onChange={(e) => handleChange("membershipPlan", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select a plan</option>
                {plans.map((plan) => (
                <option key={plan._id} value={plan.name}>
                {plan.name} (₹{plan.price})
                </option>
                ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="text-xs text-gray-500">Expiry Date *</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
              <label className="text-xs text-gray-500">Trainer</label>
              <select
              value={formData.trainer}
              onChange={(e) => handleChange("trainer", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No trainer assigned</option>
                {trainers.map((trainer) => (
                <option key={trainer._id} value={trainer.name}>
                {trainer.name} {trainer.specialty ? `(${trainer.specialty})` : ""}
                </option>
                ))}
              </select>
            </div>

          <div>
            <label className="text-xs text-gray-500">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm font-medium py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 text-sm font-medium py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Subscriber
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSubscriberModal;