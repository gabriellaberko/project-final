import { Outlet } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="   
          flex-1
          pt-16 pb-16        
          md:pt-0 md:pb-0 md:min-w-0   
        "
      >
        <Outlet />
      </main>
    </div>
  );
};