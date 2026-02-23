import { NavLink } from "react-router-dom";
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

        <NavAvatar username={userName ?? ""} /> {/* TO DO: Implement logout functionality */}

      </aside>

    </>
  )
}
