import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "../services/settingsService";

function SettingsPage() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");
      const data = await getSettings();
      setFormData(data);
    } catch (err) {
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");
      const updated = await updateSettings(formData);
      setFormData(updated);
      setMessage("Settings saved successfully.");
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">Loading settings...</p>;
  }

  if (error && !formData) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button onClick={loadSettings} className="text-sm text-blue-600 underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500">Gym information and preferences</p>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-gray-500">Gym Name</label>
          <input
            type="text"
            value={formData.gymName}
            onChange={(e) => handleChange("gymName", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1">
            <label className="text-xs text-gray-500">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500">
            "Expiring Soon" Warning Window (days)
          </label>
          <input
            type="number"
            min="1"
            value={formData.expiringSoonThresholdDays}
            onChange={(e) =>
              handleChange("expiringSoonThresholdDays", Number(e.target.value))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Subscribers within this many days of expiry are auto-flagged as
            "Expiring Soon" on the Kanban board.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`text-sm font-medium px-5 py-2 rounded-lg ${
            saving
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

export default SettingsPage;