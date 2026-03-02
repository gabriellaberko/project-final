import { useEffect } from "react";
import { useTripStore } from "../stores/TripStore";
import { useAuthStore } from "../stores/AuthStore";
import { TripsGrid } from "../components/common/TripsGrid";
import { LoadingState } from "../components/status/LoadingState";
import { ErrorState } from "../components/status/ErrorState";
import { EmptyState } from "../components/status/EmptyState";

export const MyFavoritesPage = () => { 
  const API_URL = import.meta.env.VITE_API_URL;
  const accessToken = useAuthStore(state => state.accessToken);
  const trips = useTripStore(state => state.trips);
  const setTrips = useTripStore(state => state.setTrips);
  const updateData = useTripStore(state => state.updateData);
  const loading = useTripStore(state => state.loading);
  const setLoading = useTripStore(state => state.setLoading);
  const error = useTripStore(state => state.error);
  const setError = useTripStore(state => state.setError);


  useEffect(() => {
  const fetchFavoriteTrips = async () => {
    const url = `${API_URL}/trips/my/starred`;
    setError(false);
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTrips(data);
    } catch (err) {
      console.log("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  fetchFavoriteTrips();
  }, [updateData]);
  

  return (
    <div className="px-6 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          My Favorite Trips
        </h1>
      </div>

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Error State */}
      {!loading && error && 
        <ErrorState text="Something went wrong while loading your favorite trips. Please try again in a moment." />
      }

      {/* Empty State */}
      {!loading && !error && trips && trips.length === 0 &&
        <EmptyState headline="No favorite trips yet" text="Discover trips from other travelers and save the ones you love as inspiration for your next adventure." />
      }

      {/* Grid State */}
      {!loading && !error && trips && trips.length > 0 && (
        <TripsGrid
          trips={trips}
          columns={3}
        />
      )}

    </div>
  )
};
