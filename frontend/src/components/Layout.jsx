import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout({ children, role = "retailer" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navigation = {
    retailer: [
      { label: "Dashboard", path: "/retailer/dashboard", icon: "▦" },
      { label: "My Deliveries", path: "/retailer/deliveries", icon: "▤" },
      { label: "New Delivery", path: "/retailer/deliveries/new", icon: "+" },
    ],
    dispatcher: [
      { label: "Dashboard", path: "/dispatcher/dashboard", icon: "▦" },
      { label: "Delivery Requests", path: "/dispatcher/deliveries", icon: "▤" },
    ],
    rider: [
      { label: "Dashboard", path: "/rider/dashboard", icon: "▦" },
      { label: "My Deliveries", path: "/rider/deliveries", icon: "▤" },
    ],
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reflex
            </h1>
            <p className="text-xs text-slate-400">Delivery Platform</p>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-slate-400 lg:hidden"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>

          {navigation[role].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-current/10 text-sm">
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            ☰
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-slate-400">Reflex</p>
            <p className="font-semibold capitalize text-slate-900">
              {role} workspace
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-800">
                {role === "retailer"
                  ? "Retailer"
                  : role === "dispatcher"
                  ? "Dispatcher"
                  : "Rider"}
              </p>

              <p className="text-xs capitalize text-slate-400">
                {role}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {role.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default Layout;