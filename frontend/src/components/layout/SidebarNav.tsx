import type { RouteKey } from "../../types/routes";
import { NavAvatar } from "../common/Avatar";

type Props = {
  activeRoute: RouteKey;
  onChangeRoute: (route: RouteKey) => void;
}

const items: { key: RouteKey; label: string}[] = [
  { key: "Home", label: "Home" },
  { key: "My Trips", label: "My Trips" },
  { key: "Favorites", label: "Favorites" },
  { key: "Explore", label: "Explore" },
]

export const SidebarNav = ({activeRoute, onChangeRoute}: Props) => {
  return (
    <>
      <aside className="w-64 h-screen shrink-0 flex-1 flex flex-col justify-between p-5 shadow-lg overflow-auto">
        <div>
          <div className="text-2xl font-semibold">Logo</div>
          <nav className="mt-6 flex flex-col gap-2">
            {items.map((item) => {
              const isActive = item.key === activeRoute;

              return (
                <button 
                  type="button"
                  key={item.key}
                  onClick={() => onChangeRoute(item.key)}
                  className={[
                    "w-full rounded-xl px-4 py-3 text-left text-lg font-medium transition",
                    "hover:bg-gray-100",
                    isActive ? "bg-gray-100" : "bg-transparent",
                  ].join(" ")}
                >
                  {item.label} 
                </button>
              )
            })}
          </nav>
        </div>
        <NavAvatar />
      </aside>
    </>
  )
}
