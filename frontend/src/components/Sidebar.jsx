import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowLeftRight,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRoundCog,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/", ready: true },
  { name: "Subscribers", icon: Users, path: "/", ready: true },
  { name: "Plans", icon: ClipboardList, path: "/plans", ready: true },
  { name: "Payments", icon: CreditCard, path: "/payments", ready: true },
  { name: "Attendance", icon: CalendarCheck, path: "/attendance", ready: true },
  { name: "Trainers", icon: UserRoundCog, path: "/trainers", ready: true },
  { name: "Reports", icon: BarChart3, path: "/reports", ready: true },
  { name: "Settings", icon: Settings, path: "/settings", ready: true },
];

function Sidebar() {
  const [comingSoonMessage, setComingSoonMessage] = useState("");
  const { logout } = useAuth();


  const handleComingSoonClick = (item) => {
    setComingSoonMessage(`${item.name} is coming soon 🚧`);
    setTimeout(() => setComingSoonMessage(""), 2000);
  };

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-screen flex flex-col relative">
      <div className="px-4 py-5 flex items-center gap-2 border-b border-gray-200">
        <ArrowLeftRight size={20} className="text-blue-600" />
        <span className="font-semibold text-gray-800">GYM MANAGEMENT</span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return item.ready ? (
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
              <Icon size={18} strokeWidth={2} />
              <span>{item.name}</span>
            </NavLink>
          ) : (
            <button
              key={item.name}
              onClick={() => handleComingSoonClick(item)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <Icon size={18} strokeWidth={2} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-2 py-4 border-t border-gray-200">
        <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <LogOut size={18} strokeWidth={2} />
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