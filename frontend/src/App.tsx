import { useEffect } from "react";
import { useAuthStore } from "./stores/AuthStore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicHomePage } from "./pages/PublicHomePage";
import { AuthHomePage } from "./pages/AuthHomePage";
import { MyTripsPage } from "./pages/MyTripsPage";
import { TripDetailsPage } from "./pages/TripDetailsPage";
import { AuthenticationPage } from "./pages/AuthenticationPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { ExplorePage } from "./pages/ExplorePage";
import { CreateTripPage } from "./pages/CreateTripPage";
import { AuthLayout } from "./components/layout/AuthLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { PublicLayout } from "./components/layout/PublicLayout";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { CreateActivityPage } from "./pages/CreateActivityPage";
import { MyFavoritesPage } from "./pages/MyFavoritesPage";
import { FollowListPage } from "./pages/FollowListPage";


// TO DO: Create more pages and implement routing

export const App = () => {

  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus])

  return (
    <BrowserRouter>
      <Routes>
        {/* ==== PUBLIC ROUTES ==== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicHomePage />} />
          <Route path="/login" element={<PublicHomePage />} />
          <Route path="/signup" element={<PublicHomePage />} />
        </Route>

        {/* ==== AUTH ROUTES ==== */}
        {/* <Route element={<AuthLayout />}>
          <Route path="/auth" element={<AuthenticationPage />} />
        </Route> */}

        {/* ==== MAIN APP ROUTES ==== */}
        <Route element={<AppLayout />}>
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/trips/:id" element={<TripDetailsPage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/profile/:userId/followers" element={<FollowListPage />} />
          <Route path="/profile/:userId/following" element={<FollowListPage />} />

          {/* ==== PROTECTED ROUTES ==== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<AuthHomePage />} />
            <Route path="/mytrips" element={<MyTripsPage />} />
            <Route path="/trips/new" element={<CreateTripPage />} />
            <Route path="/trips/:tripId/day/:dayId/activities/new" element={<CreateActivityPage />} />
            <Route path="/myfavorites" element={<MyFavoritesPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};