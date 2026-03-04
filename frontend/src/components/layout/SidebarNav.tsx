import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/AuthStore";
import { NavAvatar } from "../common/Avatar";
import { House, Search, Heart, Briefcase } from "lucide-react"

const items = [
  { label: "Home", path: "/dashboard", icon: House },
  { label: "My Trips", path: "/mytrips", icon: Briefcase },
  { label: "My Favorites", path: "/myfavorites", icon: Heart },
  { label: "Explore", path: "/explore", icon: Search },
];

export const SidebarNav = () => {
  const userName = useAuthStore((state) => state.userName);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* mobile header */}
      <header className="
        navbar
        flex md:hidden fixed
        top-0 left-0 right-0
        h-16 items-center justify-between
        px-5 py-10 z-50 shadow-sm
      "
      >
        <div onClick={() => navigate("/dashboard")} className="cursor-pointer">Logo</div>
        <NavAvatar username={userName ?? ""} onLogoutClick={handleLogout} />
      </header>

      {/* mobile navbar */}
      <nav className="
        navbar
        flex md:hidden fixed bottom-0
        left-0 right-0 h-16 items-center
        justify-around px-2 z-50
      "
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-1 text-xs font-medium transition",
                  isActive ? "text-white" : "text-white/70",
                ].join(" ")
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* desktop sidebar */}
      <aside className="navbar hidden md:flex w-64 h-screen shrink-0 flex-col justify-between p-5 shadow-lg overflow-auto sticky top-0">
        <div>
          <div className="text-2xl font-semibold"
            onClick={() => navigate("/dashboard")}
          >
            Logo
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  [
                    "w-full rounded-xl px-4 py-3 text-left text-lg font-medium transition",
                    "hover:bg-white hover:text-[#0066D2]",
                    isActive ? "border 2px white" : "bg-transparent",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <NavAvatar
          username={userName ?? ""}
          onLogoutClick={handleLogout}
        />
      </aside>
    </>
  )
};
