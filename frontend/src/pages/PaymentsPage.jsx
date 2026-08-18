import { useState, useEffect } from "react";
import { getPayments, createPayment, deletePayment } from "../services/paymentService";
import { getSubscribers } from "../services/subscriberService";
import { formatDate } from "../utils/statusUtils";

const paymentMethods = [
  { key: "upi", label: "UPI" },
  { key: "card", label: "Card" },
  { key: "cash", label: "Cash" },
  { key: "bank_transfer", label: "Bank Transfer" },
];

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [newPayment, setNewPayment] = useState({
    subscriber: "",
    amount: "",
    membershipPlan: "",
    paymentDate: "",
    method: "upi",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [paymentsData, subscribersData] = await Promise.all([
        getPayments(),
        getSubscribers(),
      ]);
      setPayments(paymentsData);
      setSubscribers(subscribersData);
    } catch (err) {
      setError("Failed to load payments. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubscriberSelect(subscriberId) {
    const subscriber = subscribers.find((s) => s._id === subscriberId);
    setNewPayment((prev) => ({
      ...prev,
      subscriber: subscriberId,
      membershipPlan: subscriber ? subscriber.membershipPlan : "",
    }));
  }

  async function handleAddPayment(e) {
    e.preventDefault();

    if (!newPayment.subscriber || !newPayment.amount || !newPayment.paymentDate) {
      setError("Subscriber, amount, and payment date are required.");
      return;
    }

    try {
      const created = await createPayment(newPayment);
      setPayments((prev) => [created, ...prev]);
      setNewPayment({
        subscriber: "",
        amount: "",
        membershipPlan: "",
        paymentDate: "",
        method: "upi",
        notes: "",
      });
      setIsAdding(false);
      setError("");
    } catch (err) {
      setError("Failed to record payment.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this payment record? This cannot be undone.")) return;

    try {
      await deletePayment(id);
      setPayments((prev) => prev.filter((payment) => payment._id !== id));
    } catch (err) {
      setError("Failed to delete payment.");
    }
  }

  const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Payments</h1>
          <p className="text-sm text-gray-500">Track subscriber payments and transactions</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          {isAdding ? "Cancel" : "+ Record Payment"}
        </button>
      </div>

      {!loading && (
        <p className="text-sm text-gray-500 mb-6">
          Total collected: <span className="font-semibold text-gray-800">₹{totalCollected}</span>
        </p>
      )}

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {isAdding && (
        <form
          onSubmit={handleAddPayment}
          className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-3 items-end flex-wrap"
        >
          <div>
            <label className="text-xs text-gray-500">Subscriber</label>
            <select
              value={newPayment.subscriber}
              onChange={(e) => handleSubscriberSelect(e.target.value)}
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 w-48"
            >
              <option value="">Select subscriber</option>
              {subscribers.map((subscriber) => (
                <option key={subscriber._id} value={subscriber._id}>
                  {subscriber.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500">Plan</label>
            <input
              type="text"
              value={newPayment.membershipPlan}
              onChange={(e) =>
                setNewPayment({ ...newPayment, membershipPlan: e.target.value })
              }
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 w-36"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Amount (₹)</label>
            <input
              type="number"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 w-28"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Date</label>
            <input
              type="date"
              value={newPayment.paymentDate}
              onChange={(e) =>
                setNewPayment({ ...newPayment, paymentDate: e.target.value })
              }
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Method</label>
            <select
              value={newPayment.method}
              onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
              className="block border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
            >
              {paymentMethods.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="text-xs text-gray-500">Notes</label>
            <input
              type="text"
              value={newPayment.notes}
              onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
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
        <p className="text-sm text-gray-500">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-sm text-gray-400">No payments recorded yet.</p>
      ) : (
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Subscriber</th>
              <th className="text-left px-4 py-3">Plan</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Method</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {payment.subscriber ? payment.subscriber.name : "Deleted subscriber"}
                </td>
                <td className="px-4 py-3 text-gray-600">{payment.membershipPlan}</td>
                <td className="px-4 py-3 text-gray-800">₹{payment.amount}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(payment.paymentDate)}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">
                  {payment.method.replace("_", " ")}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(payment._id)}
                    className="text-red-600 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PaymentsPage;