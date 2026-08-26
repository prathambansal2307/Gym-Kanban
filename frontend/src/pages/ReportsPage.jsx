import { useState, useEffect } from "react";
import { getSubscribers } from "../services/subscriberService";
import { getPayments } from "../services/paymentService";
import { getAttendance } from "../services/attendanceService";
import { formatDate } from "../utils/statusUtils";

const statusLabels = {
  new: "New / Paid",
  onboarding: "Onboarding",
  active: "Active",
  onhold: "On Hold / Frozen",
  expiringsoon: "Expiring Soon",
  renewaldue: "Renewal Due",
  expired: "Expired",
};

const sessionLabels = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

function todayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function StatCard({ label, value, highlight }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? "text-red-600" : "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}

function BarRow({ label, count, max }) {
  const widthPercent = max > 0 ? (count / max) * 100 : 0;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-36 text-gray-600 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full"
          style={{ width: `${widthPercent}%` }}
        />
      </div>
      <span className="w-8 text-right text-gray-700 font-medium">{count}</span>
    </div>
  );
}

function ReportsPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [subscribersData, paymentsData, attendanceData] = await Promise.all([
        getSubscribers(),
        getPayments(),
        getAttendance(),
      ]);
      setSubscribers(subscribersData);
      setPayments(paymentsData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load report data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">Loading reports...</p>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button onClick={loadData} className="text-sm text-blue-600 underline">
          Try again
        </button>
      </div>
    );
  }

  const statusCounts = subscribers.reduce((counts, subscriber) => {
    counts[subscriber.status] = (counts[subscriber.status] || 0) + 1;
    return counts;
  }, {});

  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);
  const activeCount = statusCounts.active || 0;
  const needsAttentionCount =
    (statusCounts.expiringsoon || 0) +
    (statusCounts.renewaldue || 0) +
    (statusCounts.expired || 0);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const revenueByPlan = payments.reduce((totals, payment) => {
    totals[payment.membershipPlan] = (totals[payment.membershipPlan] || 0) + payment.amount;
    return totals;
  }, {});

  const maxPlanRevenue = Math.max(...Object.values(revenueByPlan), 1);

  const recentPayments = payments.slice(0, 5);

  const today = todayString();
  const todaysAttendance = attendance.filter(
    (record) => record.checkInDate.split("T")[0] === today
  );

  const attendanceBySession = todaysAttendance.reduce((counts, record) => {
    counts[record.session] = (counts[record.session] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
            <div>
            <h1 className="text-xl font-bold text-gray-800">Reports</h1>
            <p className="text-sm text-gray-500">Overview of subscribers, revenue, and attendance</p>
            </div>
            <button
                onClick={loadData}
                className="text-sm font-medium text-blue-600 border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-50"
            >
            🔄 Refresh
            </button>
        </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Subscribers" value={subscribers.length} />
        <StatCard label="Active" value={activeCount} />
        <StatCard label="Needs Attention" value={needsAttentionCount} highlight={needsAttentionCount > 0} />
        <StatCard label="Total Revenue" value={`₹${totalRevenue}`} />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Subscribers by Status</h2>
          <div className="space-y-2.5">
            {Object.entries(statusLabels).map(([key, label]) => (
              <BarRow
                key={key}
                label={label}
                count={statusCounts[key] || 0}
                max={maxStatusCount}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Revenue by Plan</h2>
          {Object.keys(revenueByPlan).length === 0 ? (
            <p className="text-sm text-gray-400">No payments recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(revenueByPlan).map(([plan, amount]) => (
                <BarRow key={plan} label={plan} count={amount} max={maxPlanRevenue} />
              ))}
            </div>
          )}

          <h2 className="text-sm font-semibold text-gray-700 mt-6 mb-3">
            Today's Attendance ({todaysAttendance.length})
          </h2>
          {todaysAttendance.length === 0 ? (
            <p className="text-sm text-gray-400">No check-ins recorded today.</p>
          ) : (
            <div className="flex gap-4 text-sm">
              {Object.entries(sessionLabels).map(([key, label]) => (
                <div key={key} className="text-center">
                  <p className="text-lg font-bold text-gray-800">
                    {attendanceBySession[key] || 0}
                  </p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Payments</h2>
        {recentPayments.length === 0 ? (
          <p className="text-sm text-gray-400">No payments yet.</p>
        ) : (
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Subscriber</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr key={payment._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {payment.subscriber ? payment.subscriber.name : "Deleted subscriber"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{payment.membershipPlan}</td>
                  <td className="px-4 py-3 text-gray-800">₹{payment.amount}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(payment.paymentDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;