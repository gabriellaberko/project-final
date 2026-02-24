import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./PublicNavbar";

export const PublicLayout = () => {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
};