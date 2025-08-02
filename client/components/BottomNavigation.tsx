import { Home, Trophy, User, Users, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface BottomNavigationProps {
  className?: string;
}

export default function BottomNavigation({ className }: BottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      icon: Home,
      label: "Inicio",
      path: "/",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Users,
      label: "Equipos",
      path: "/choose-team",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: Trophy,
      label: "Apps",
      path: "/apps",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: User,
      label: "Perfil",
      path: "/profile",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-t border-white/10 ${className} z-50`}
      style={{
        boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="w-full flex safe-area-pb relative">
        {/* Indicator line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-emerald-500 via-yellow-500 to-purple-500"></div>

        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center py-4 px-2 text-sm transition-all duration-300 relative group ${
                isActive
                  ? "text-white scale-105"
                  : "text-white/70 hover:text-white hover:scale-105"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div
                  className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r ${item.color} rounded-b-full`}
                />
              )}

              {/* Icon container */}
              <div
                className={`relative p-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-br ${item.color} shadow-lg`
                    : "bg-white/5 group-hover:bg-white/10"
                }`}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-white"
                      : "text-white/70 group-hover:text-white"
                  }
                />

                {/* Glow effect for active */}
                {isActive && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-md opacity-50 -z-10`}
                  />
                )}
              </div>

              <span
                className={`mt-2 font-medium text-xs transition-all duration-300 ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-white/70 group-hover:text-white"
                }`}
              >
                {item.label}
              </span>

              {/* Ripple effect */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 transform scale-0 group-active:scale-100 transition-transform duration-150 bg-white/10 rounded-2xl"></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
