import { useState, useEffect } from "react"
import { useAuthStore } from "../stores/AuthStore";
import { TripsGrid } from "../components/common/TripsGrid";
import { SearchBar } from "../components/common/SearchBar";
import { useTripStore } from "../stores/TripStore";
import { LoadingState } from "../components/status/LoadingState";
import { ErrorState } from "../components/status/ErrorState";


export const ExplorePage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const loading = useTripStore(state => state.loading);
  const setLoading = useTripStore(state => state.setLoading);
  const error = useTripStore(state => state.error);
  const setError = useTripStore(state => state.setError);
  const trips = useTripStore(state => state.trips);
  const setTrips = useTripStore(state => state.setTrips);
  const accessToken = useAuthStore(state => state.accessToken);


  const fetchPublicTrips = async (destination?: string) => {
    const url = `${API_URL}/trips`;
    setLoading(true);
    setError(false);

    try {
      const headers: HeadersInit = {};

      // Send token only if it exists
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const query = destination
        ? `?destination=${encodeURIComponent(destination)}`
        : "";

      const response = await fetch(`${url}${query}`, {
        method: "GET",
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch trips");
      }

      setTrips(data.response);

    } catch (err) {
      console.log("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicTrips();
  }, [accessToken]);


  return (
    <div className="px-6 py-8">
      <div className="w-full h-72 bg-gray-200 rounded-2xl mb-10 flex items-center justify-center">
        <p className="text-gray-500">Lottie animation</p>
      </div>

      {/* SearchBar */}
      <div className="mb-10">
        <SearchBar onSearch={fetchPublicTrips} />
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-44 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Error State */}
      {!loading && error && 
        <ErrorState text="We couldn't load trips right now. Please try again in a moment." />
      }

      {!loading && !error && trips && trips.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8">
          <TripsGrid
            trips={trips}
            columns={4}
          />
        </div>
      )}
    </div>
  );
};