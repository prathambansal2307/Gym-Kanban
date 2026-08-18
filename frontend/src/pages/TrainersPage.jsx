import { useState, useEffect } from "react";
import {
  getTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from "../services/trainerService";

function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [isAdding, setIsAdding] = useState(false);
  const [newTrainer, setNewTrainer] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    loadTrainers();
  }, []);

  async function loadTrainers() {
    try {
      setLoading(true);
      setError("");
      const data = await getTrainers();
      setTrainers(data);
    } catch (err) {
      setError("Failed to load trainers. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(trainer) {
    setEditingId(trainer._id);
    setEditForm(trainer);
  }

  async function saveEdit() {
    try {
      const updated = await updateTrainer(editingId, editForm);
      setTrainers((prev) =>
        prev.map((trainer) => (trainer._id === editingId ? updated : trainer))
      );
      setEditingId(null);
    } catch (err) {
      setError("Failed to update trainer.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this trainer? This cannot be undone.")) return;

    try {
      await deleteTrainer(id);
      setTrainers((prev) => prev.filter((trainer) => trainer._id !== id));
    } catch (err) {
      setError("Failed to delete trainer.");
    }
  }

  async function handleAddTrainer(e) {
    e.preventDefault();

    if (!newTrainer.name) {
      setError("Trainer name is required.");
      return;
    }

    try {
      const created = await createTrainer(newTrainer);
      setTrainers((prev) => [...prev, created]);
      setNewTrainer({ name: "", specialty: "", phone: "", email: "" });
      setIsAdding(false);
      setError("");
    } catch (err) {
      setError("Failed to add trainer.");
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Trainers</h1>
          <p className="text-sm text-gray-500">Manage gym trainers and their specialties</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          {isAdding ? "Cancel" : "+ Add Trainer"}
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {isAdding && (
        <form
          onSubmit={handleAddTrainer}
          className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-3 items-end flex-wrap"
        >
          <div>
            <label className="text-xs text-gray-500">Name</label>
            <input
              type="text"
              value={newTrainer.name}
              onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Specialty</label>
            <input
              type="text"
              value={newTrainer.specialty}
              onChange={(e) => setNewTrainer({ ...newTrainer, specialty: e.target.value })}
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Phone</label>
            <input
              type="text"
              value={newTrainer.phone}
              onChange={(e) => setNewTrainer({ ...newTrainer, phone: e.target.value })}
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Email</label>
            <input
              type="email"
              value={newTrainer.email}
              onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
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
        <p className="text-sm text-gray-500">Loading trainers...</p>
      ) : trainers.length === 0 ? (
        <p className="text-sm text-gray-400">No trainers yet. Add your first one above.</p>
      ) : (
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Specialty</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer) =>
              editingId === trainer._id ? (
                <tr key={trainer._id} className="border-t border-gray-100 bg-blue-50">
                  <td className="px-4 py-2">
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      value={editForm.specialty}
                      onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={saveEdit} className="text-green-700 font-medium hover:underline">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500 hover:underline">
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={trainer._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{trainer.name}</td>
                  <td className="px-4 py-3 text-gray-600">{trainer.specialty || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{trainer.phone || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{trainer.email || "—"}</td>
                  <td className="px-4 py-3 space-x-3">
                    <button onClick={() => startEditing(trainer)} className="text-blue-600 font-medium hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(trainer._id)} className="text-red-600 font-medium hover:underline">
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

export default TrainersPage;