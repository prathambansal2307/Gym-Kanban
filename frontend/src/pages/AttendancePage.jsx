import { useState, useEffect } from "react";
import {
  getAttendance,
  bulkMarkAttendance,
  deleteAttendance,
} from "../services/attendanceService";
import { getSubscribers } from "../services/subscriberService";

const sessions = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
  { key: "night", label: "Night" },
];

function todayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function AttendancePage() {
  const [subscribers, setSubscribers] = useState([]);
  const [date, setDate] = useState(todayString());
  const [session, setSession] = useState("morning");

  const [alreadyMarkedIds, setAlreadyMarkedIds] = useState(new Set());
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [existingRecords, setExistingRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  useEffect(() => {
    if (date && session) loadExistingForSession();
  }, [date, session]);

  async function loadSubscribers() {
    try {
      setLoading(true);
      const data = await getSubscribers();
      setSubscribers(data);
    } catch (err) {
      setError("Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  }

  async function loadExistingForSession() {
    try {
      const records = await getAttendance(date, session);
      const ids = new Set(records.map((r) => r.subscriber?._id));
      setAlreadyMarkedIds(ids);
      setCheckedIds(new Set());
      setExistingRecords(records);
      setMessage("");
    } catch (err) {
      setError("Failed to check existing attendance.");
    }
  }

  function toggleSubscriber(id) {
    if (alreadyMarkedIds.has(id)) return; // already marked, can't toggle

    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleSaveAttendance() {
    if (checkedIds.size === 0) {
      setError("Tick at least one subscriber before saving.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const result = await bulkMarkAttendance(date, session, [...checkedIds]);
      setMessage(
        `Marked ${result.created.length} subscriber(s) present.` +
          (result.skipped.length
            ? ` ${result.skipped.length} were already marked.`
            : "")
      );
      await loadExistingForSession();
    } catch (err) {
      setError("Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUnmark(recordId) {
    if (!window.confirm("Remove this attendance record?")) return;

    try {
      await deleteAttendance(recordId);
      await loadExistingForSession();
    } catch (err) {
      setError("Failed to remove record.");
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Attendance</h1>
        <p className="text-sm text-gray-500">Mark members attendance everyday!</p>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <div>
          <label className="text-xs text-gray-500">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Session</label>
          <select
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
          >
            {sessions.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={saving || checkedIds.size === 0}
          className={`text-sm font-medium px-4 py-2 rounded-lg ${
            saving || checkedIds.size === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {saving ? "Saving..." : `Save Attendance (${checkedIds.size})`}
        </button>
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

      {loading ? (
        <p className="text-sm text-gray-500">Loading subscribers...</p>
      ) : (
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
          {subscribers.map((subscriber) => {
            const isAlreadyMarked = alreadyMarkedIds.has(subscriber._id);
            const isChecked = isAlreadyMarked || checkedIds.has(subscriber._id);

            return (
              <label
                key={subscriber._id}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  isAlreadyMarked ? "bg-green-50" : "hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isAlreadyMarked}
                    onChange={() => toggleSubscriber(subscriber._id)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-800">{subscriber.name}</span>
                  <span className="text-gray-400 text-xs">{subscriber.membershipPlan}</span>
                </div>

                {isAlreadyMarked && (
                  <span className="text-xs text-green-700 font-medium">
                    ✓ Already marked present
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {existingRecords.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Marked for this session
          </h2>
          <div className="space-y-1">
            {existingRecords.map((record) => (
              <div
                key={record._id}
                className="flex items-center justify-between text-sm px-4 py-2 border border-gray-100 rounded-lg"
              >
                <span className="text-gray-700">
                  {record.subscriber ? record.subscriber.name : "Deleted subscriber"}
                </span>
                <button
                  onClick={() => handleUnmark(record._id)}
                  className="text-red-600 text-xs font-medium hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendancePage;