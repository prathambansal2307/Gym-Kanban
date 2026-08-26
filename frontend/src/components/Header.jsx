import { useState, useEffect } from "react";
import { getPlans } from "../services/planService";

function Header({
  searchTerm,
  onSearchChange,
  planFilter,
  onPlanFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  onAddClick,

}) {
    const [plans, setPlans] = useState([]);

      useEffect(() => {
      getPlans()
      .then(setPlans)
      .catch(() => setPlans([]));
    }, []);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">        <div>
          <h1 className="text-xl font-bold text-gray-800">Paid Gym Subscribers</h1>
          <p className="text-sm text-gray-500">Track and manage all paid gym subscribers</p>
        </div>

        <button
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
        + Add Subscriber
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">        
          <input
          type="text"
          placeholder="Search subscribers..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[180px] max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"        />

        <select
          value={planFilter}
          onChange={(e) => onPlanFilterChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Plans</option>
            {plans.map((plan) => (
              <option key={plan._id} value={plan.name}>
              {plan.name}
              </option>
            ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="new">New / Paid</option>
          <option value="onboarding">Onboarding</option>
          <option value="active">Active</option>
          <option value="onhold">On Hold / Frozen</option>
          <option value="expiringsoon">Expiring Soon</option>
          <option value="renewaldue">Renewal Due</option>
          <option value="expired">Expired</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="expiry">Sort By: Expiry Date (Soonest)</option>
          <option value="name">Sort By: Name</option>
        </select>
      </div>
    </div>
  );
}

export default Header;