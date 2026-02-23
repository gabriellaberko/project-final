import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/AuthStore";
import { NavAvatar } from "../common/Avatar";

const items = [
  { label: "Home", path: "/" },
  { label: "My Trips", path: "/my" },
  { label: "Favorites", path: "/favorites" },
  { label: "Explore", path: "/explore" },
];

export const SidebarNav = () => {
  const userName = useAuthStore((state) => state.userName);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* mobile header */}
      <header className="flex md:hidden fixed top-0 left-0 right-0 h-16 items-center justify-between px-5 z-50">
        <div>Logo</div>
        <NavAvatar username={userName ?? ""} />
      </header>

      {/* mobile navbar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 items-center justify-around px-2 z-50">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              [].join(" ")
            }
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* desktop sidebar */}
      <aside className="hidden md:flex w-64 h-screen shrink-0 flex-col justify-between p-5 shadow-lg overflow-auto">
        <div>
          <div className="text-2xl font-semibold">Logo</div>

          <nav className="mt-6 flex flex-col gap-2">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  [
                    "w-full rounded-xl px-4 py-3 text-left text-lg font-medium transition",
                    "hover:bg-gray-100",
                    isActive ? "bg-gray-100" : "bg-transparent",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {isAuthenticated && (
          <NavAvatar
            username={userName ?? ""}
            onLogoutClick={handleLogout}
          />
        )}
        {!isAuthenticated && (
          <div className="flex items-center gap-4 ml-2">
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="
                text-sm font-medium
                text-gray-500 cursor-pointer
                hover:text-gray-900
                transition-colors duration-200
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-gray-300
                rounded-md
             "
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/auth?mode=signup")}
              className=" 
                text-sm font-medium
                px-4 py-2 cursor-pointer
                rounded-lg
                bg-gray-200 text-gray-900
                hover:bg-gray-300
                active:scale-[0.98]
                transition-all duration-200
              "
            >
              Sign up
            </button>
          </div>
        )}
      </aside>

    </>
  )
};
