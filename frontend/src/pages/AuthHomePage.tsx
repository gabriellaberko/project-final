import { useEffect } from "react";
import { useTripStore } from "../stores/TripStore";
import { ExploreTripCard } from "../components/common/ExploreTripCard";

export const AuthHomePage = () => {
  const trips = useTripStore(state => state.trips);
  const fetchPublicTrips = useTripStore(state => state.fetchPublicTrips);
  const loading = useTripStore(state => state.loading);
  const error = useTripStore(state => state.error);

  useEffect(() => {
    fetchPublicTrips("?sort=likes&limit=5");
  }, [fetchPublicTrips]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p>Loading trips...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p>Something went wrong.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-10">
        Trending tips
      </h1>

      <div className="flex flex-col gap-6">
        {trips && trips.length > 0 ? (
          trips.map(trip => (
            <ExploreTripCard
              key={trip._id}
              trip={trip}
              variant="horizontal"
            />
          ))
        ) : (
          <p>No trips found.</p>
        )}
      </div>
    </div>
  )
};