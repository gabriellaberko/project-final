import { useEffect } from "react";
import { useAuthStore } from "./stores/AuthStore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyTripsPage } from "./pages/MyTripsPage";
import { TripDetailsPage } from "./pages/TripDetailsPage";
import { SidebarNav } from "./components/layout/SidebarNav";
import { RouteKey } from "./types/routes";

type Props = {
  activeRoute: RouteKey;
  onChangeRoute: (route: RouteKey) => void;
}

// TO DO: Create more pages and implement routing

export const App = ({ activeRoute, onChangeRoute }: Props) => {

  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);
  
  useEffect(() => { 
    checkAuthStatus();
  }, [checkAuthStatus])

  return (
    <>
    <SidebarNav
      activeRoute={activeRoute}
      onChangeRoute={onChangeRoute}
    />
    <BrowserRouter>
      <Routes>
        <Route path="/mytrips" element={<MyTripsPage/>} />
        <Route path="/trip/:id" element={<TripDetailsPage/>} />
      </Routes>
    </BrowserRouter>
    </>
  );
};
