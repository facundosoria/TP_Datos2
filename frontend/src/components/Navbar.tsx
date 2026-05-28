import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/productos", label: "Productos", icon: "📦" },
  { to: "/comparador", label: "Comparador", icon: "🔍" },
  { to: "/paquetes", label: "Paquetes", icon: "🚚" },
  { to: "/incidencias", label: "Incidencias", icon: "⚠️" },
  { to: "/grafo", label: "Grafo", icon: "🕸️" },
  { to: "/analitica", label: "Analítica", icon: "📈" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-60 h-full bg-slate-900 text-white flex flex-col flex-shrink-0">
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-lg font-bold text-white leading-tight">
          ImportTrace
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Graph</p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white font-medium"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer con usuario y logout */}
      <div className="px-4 py-4 border-t border-slate-700 space-y-3">
        {user && (
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{user.nombre}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.username}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <span>↩</span>
          Cerrar sesión
        </button>
        <p className="text-[10px] text-slate-600 px-2">Neo4j • Bases de Datos II</p>
      </div>
    </aside>
  );
}
