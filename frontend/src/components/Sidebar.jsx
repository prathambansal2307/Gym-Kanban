import { useState } from "react";

const navItems = [
  { name: "Dashboard", icon: "🏠", active: true },
  { name: "Subscribers", icon: "👥", active: false },
  { name: "Plans", icon: "📋", active: false },
  { name: "Payments", icon: "💳", active: false },
  { name: "Attendance", icon: "📅", active: false },
  { name: "Trainers", icon: "🧑‍🏫", active: false },
  { name: "Reports", icon: "📊", active: false },
  { name: "Settings", icon: "⚙️", active: false },
];

function Sidebar() {
  const [comingSoonMessage, setComingSoonMessage] = useState("");

  const handleNavClick = (item) => {
    if (item.name === "Dashboard") return;

    setComingSoonMessage(`${item.name} is coming soon 🚧`);

    setTimeout(() => {
      setComingSoonMessage("");
    }, 2000);
  };

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="px-4 py-5 flex items-center gap-2 border-b border-gray-200">
        <span className="text-xl">↔️</span>
        <span className="font-semibold text-gray-800">GYM MANAGEMENT</span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavClick(item)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-gray-200">
        <button
          onClick={() => handleNavClick({ name: "Logout" })}
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