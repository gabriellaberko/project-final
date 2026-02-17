import { useEffect } from "react";
import { useAuthStore } from "./stores/AuthStore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyTripsPage } from "./pages/MyTripsPage";
import { TripDetailsPage } from "./pages/TripDetailsPage";

// TO DO: Create more pages and implement routing

export const App = () => {

  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);
  
  useEffect(() => { 
    checkAuthStatus();
  }, [checkAuthStatus])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mytrips" element={<MyTripsPage/>} />
        <Route path="/trip/:id" element={<TripDetailsPage/>} />
      </Routes>
    </BrowserRouter>
  );
};
