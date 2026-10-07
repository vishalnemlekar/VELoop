import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import BrandMark from "../BrandMark";

const navItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Withdrawals", to: "/admin/withdrawals" },
  { label: "Wallet", to: "/admin/wallet" },
  { label: "Reconciliation", to: "/admin/reconciliation" },
];

const AdminNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0a1f]/85 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* BRAND */}
        <Link
          to="/admin"
          className="flex items-center gap-3"
        >
          <BrandMark />

          <div className="text-left">
            <p className="text-lg font-bold tracking-tight">VELOop</p>
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 sm:block">
              Admin Panel
            </p>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav aria-label="Admin navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                [
                  "rounded-lg px-4 py-2 text-sm transition",
                  isActive
                    ? "bg-violet-500/20 font-semibold text-white ring-1 ring-violet-300/20"
                    : "font-medium text-indigo-100/65 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ADMIN USER */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-neutral-400">
              Administrator
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-indigo-100 transition hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
      <nav aria-label="Mobile admin navigation" className="flex gap-1 overflow-x-auto border-t border-white/10 px-5 py-2 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              [
                "shrink-0 rounded-lg px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                isActive
                  ? "bg-violet-500/20 font-semibold text-white ring-1 ring-violet-300/20"
                  : "font-medium text-indigo-100/65 hover:bg-white/10 hover:text-white",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default AdminNavbar;