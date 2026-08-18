import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: "🏠", path: "/", ready: true },
  { name: "Subscribers", icon: "👥", path: "/", ready: true },
  { name: "Plans", icon: "📋", path: "/plans", ready: true },
  { name: "Payments", icon: "💳", path: "/payments", ready: true },
  { name: "Attendance", icon: "📅", path: "/attendance", ready: true },
  { name: "Trainers", icon: "🧑‍🏫", path: "/trainers", ready: true },
  { name: "Reports", icon: "📊", path: "/reports", ready: true },
  { name: "Settings", icon: "⚙️", path: "/settings", ready: false },
];

function Sidebar() {
  const [comingSoonMessage, setComingSoonMessage] = useState("");

  const handleComingSoonClick = (item) => {
    setComingSoonMessage(`${item.name} is coming soon 🚧`);
    setTimeout(() => setComingSoonMessage(""), 2000);
  };

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-screen flex flex-col relative">
      <div className="px-4 py-5 flex items-center gap-2 border-b border-gray-200">
        <span className="text-xl">↔️</span>
        <span className="font-semibold text-gray-800">GYM MANAGEMENT</span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) =>
          item.ready ? (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ) : (
            <button
              key={item.name}
              onClick={() => handleComingSoonClick(item)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          )
        )}
      </nav>

      <div className="px-2 py-4 border-t border-gray-200">
        <button
          onClick={() => handleComingSoonClick({ name: "Logout" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>

      {comingSoonMessage && (
        <div className="absolute bottom-6 left-64 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {comingSoonMessage}
        </div>
      )}
    </div>
  );
}

export default Sidebar;