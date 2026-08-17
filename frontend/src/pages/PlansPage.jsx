import { useState, useEffect } from "react";
import { getPlans, createPlan, updatePlan, deletePlan } from "../services/planService";

function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    durationMonths: "",
    description: "",
  });

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      setLoading(true);
      setError("");
      const data = await getPlans();
      setPlans(data);
    } catch (err) {
      setError("Failed to load plans. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(plan) {
    setEditingId(plan._id);
    setEditForm(plan);
  }

  async function saveEdit() {
    try {
      const updated = await updatePlan(editingId, editForm);
      setPlans((prev) =>
        prev.map((plan) => (plan._id === editingId ? updated : plan))
      );
      setEditingId(null);
    } catch (err) {
      setError("Failed to update plan.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this plan? This cannot be undone.")) return;

    try {
      await deletePlan(id);
      setPlans((prev) => prev.filter((plan) => plan._id !== id));
    } catch (err) {
      setError("Failed to delete plan.");
    }
  }

  async function handleAddPlan(e) {
    e.preventDefault();

    if (!newPlan.name || !newPlan.price || !newPlan.durationMonths) {
      setError("Name, price, and duration are required.");
      return;
    }

    try {
      const created = await createPlan(newPlan);
      setPlans((prev) => [...prev, created]);
      setNewPlan({ name: "", price: "", durationMonths: "", description: "" });
      setIsAdding(false);
      setError("");
    } catch (err) {
      setError("Failed to add plan.");
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Membership Plans</h1>
          <p className="text-sm text-gray-500">Manage the plans offered to subscribers</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          {isAdding ? "Cancel" : "+ Add Plan"}
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {isAdding && (
        <form
          onSubmit={handleAddPlan}
          className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-3 items-end flex-wrap"
        >
          <div>
            <label className="text-xs text-gray-500">Name</label>
            <input
              type="text"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Price (₹)</label>
            <input
              type="number"
              value={newPlan.price}
              onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 w-28"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Duration (months)</label>
            <input
              type="number"
              value={newPlan.durationMonths}
              onChange={(e) => setNewPlan({ ...newPlan, durationMonths: e.target.value })}
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 w-28"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs text-gray-500">Description</label>
            <input
              type="text"
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading plans...</p>
      ) : plans.length === 0 ? (
        <p className="text-sm text-gray-400">No plans yet. Add your first one above.</p>
      ) : (
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Duration</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) =>
              editingId === plan._id ? (
                <tr key={plan._id} className="border-t border-gray-100 bg-blue-50">
                  <td className="px-4 py-2">
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={editForm.durationMonths}
                      onChange={(e) =>
                        setEditForm({ ...editForm, durationMonths: e.target.value })
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={saveEdit}
                      className="text-green-700 font-medium hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={plan._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{plan.name}</td>
                  <td className="px-4 py-3 text-gray-600">₹{plan.price}</td>
                  <td className="px-4 py-3 text-gray-600">{plan.durationMonths} mo</td>
                  <td className="px-4 py-3 text-gray-500">{plan.description || "—"}</td>
                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() => startEditing(plan)}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PlansPage;