import { useEffect } from "react";
import { useAuthStore } from "./stores/AuthStore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyTripsPage } from "./pages/MyTripsPage";
import { TripDetailsPage } from "./pages/TripDetailsPage";
import { AuthenticationPage } from "./pages/AuthenticationPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { ExplorePage } from "./pages/ExplorePage";
import { CreateTripPage } from "./pages/CreateTripPage";
import { AuthLayout } from "./components/layout/AuthLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { CreateActivityPage } from "./pages/CreateActivityPage";

// TO DO: Create more pages and implement routing

export const App = () => {

  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth" element={<AuthenticationPage />} />
        </Route>


        <Route element={<AppLayout />}>
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/trips/:id" element={<TripDetailsPage />} />


          <Route element={<ProtectedRoute />}>
            <Route path="/mytrips" element={<MyTripsPage />} />
            <Route path="/trips/new" element={<CreateTripPage />} />
            <Route path="/trips/:tripId/day/:dayId/activities/new" element={<CreateActivityPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};