import { useState, useEffect } from "react"
import { useAuthStore } from "../stores/AuthStore";
import { TripsGrid } from "../components/common/TripsGrid";
import { SearchBar } from "../components/common/SearchBar";
import { useTripStore } from "../stores/TripStore";
import { LoadingState } from "../components/status/LoadingState";
import { ErrorState } from "../components/status/ErrorState";
import { EmptyState } from "../components/status/EmptyState";
import Player from "lottie-react";
import exploreAnimation from "../assets/explore-animation.json";


export const ExplorePage = () => {
  const loading = useTripStore(state => state.loading);
  const setLoading = useTripStore(state => state.setLoading);
  const error = useTripStore(state => state.error);
  const setError = useTripStore(state => state.setError);
  const trips = useTripStore(state => state.trips);
  const setTrips = useTripStore(state => state.setTrips);
  const fetchPublicTrips = useTripStore(state => state.fetchPublicTrips);


  useEffect(() => {
    fetchPublicTrips();
  }, []);

  const handleSearch = (destination?: string) => {
    if (destination) {
      fetchPublicTrips(`?destination=${encodeURIComponent(destination)}`);
    } else {
      fetchPublicTrips();
    }
  };


  return (
    <div className="px-6 py-8">
      <div className="w-full h-72 rounded-2xl mb-10 flex items-center justify-center overflow-hidden">
        <Player
          animationData={exploreAnimation}
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* SearchBar */}
      <div className="mb-10">
        <SearchBar onSearch={handleSearch} />
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

      {/* Empty State */}
      {!loading && !error && trips && trips.length === 0 &&
        <EmptyState headline="No matching trips" text="There are no trips matching your current filter. Try something else!" />
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