import { Outlet } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="   
          flex-1
          bg-gray-50
          pt-16 pb-16        
          md:pt-0 md:pb-0    
        "
      >
        <Outlet />
      </main>
    </div>
  );
};