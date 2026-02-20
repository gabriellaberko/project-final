import { Outlet } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};