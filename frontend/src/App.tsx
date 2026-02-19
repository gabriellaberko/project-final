import { useEffect } from "react";
import { useAuthStore } from "./stores/AuthStore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyTripsPage } from "./pages/MyTripsPage";
import { TripDetailsPage } from "./pages/TripDetailsPage";
import { AuthenticationPage } from "./pages/AuthenticationPage";
import { ExplorePage } from "./pages/ExplorePage";

// TO DO: Create more pages and implement routing

export const App = () => {

  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/mytrips" element={<MyTripsPage />} />
        <Route path="/trips/:id" element={<TripDetailsPage />} />
        <Route path="/auth" element={<AuthenticationPage />} />
      </Routes>
    </BrowserRouter>
  );
};