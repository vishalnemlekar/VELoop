import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import BrandMark from "./BrandMark";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: "⌂" },
  { label: "Wallet", to: "/wallet", icon: "◈" },
  { label: "Withdraw", to: "/withdraw", icon: "⇄" },
];

const mobileNavItems = [
  { label: "Home", to: "/dashboard", icon: "⌂" },
  { label: "Earn", to: "/dashboard", icon: "✦" },
  { label: "Wallet", to: "/wallet", icon: "◈" },
  { label: "Rewards", to: "/withdraw", icon: "⇄" },
  { label: "Profile", to: "/dashboard", icon: "◉" },
];

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0a1f]/80 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
        >
          <BrandMark className="h-10 w-10 rounded-xl" />
          <div className="text-left">
            <p className="text-lg font-bold tracking-tight text-neutral-950">VELOop</p>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 sm:block">
              rewards
            </p>
          </div>
        </button>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-violet-500/20 text-white shadow-sm ring-1 ring-violet-300/25"
                    : "text-indigo-100/65 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base text-indigo-100 transition hover:border-white/20 hover:bg-white/10"
          >
            🔔
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-3 py-1.5 sm:flex">
            <span aria-hidden="true" className="text-sm">💎</span>
            <span className="text-sm font-semibold text-yellow-200">Wallet</span>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-xs font-bold text-white">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold leading-tight text-white">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-indigo-200/60">Member</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-indigo-100 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0c0a1f]/95 px-2 py-2 text-white shadow-[0_-18px_40px_-28px_rgba(0,0,0,0.9)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] font-medium transition",
                  isActive ? "bg-violet-500/25 text-white ring-1 ring-violet-300/20" : "text-indigo-100/60 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              <span aria-hidden="true" className="mb-1 text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default DashboardNavbar;