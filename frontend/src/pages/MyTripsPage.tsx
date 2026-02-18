import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/AuthStore";
import { TripsGrid } from "../components/common/TripsGrid";

interface Trip {
  _id: string;
  destination: string;
  days: { dayNumber: number }[];
  tripName?: string; // optional
}

export const MyTripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useAuthStore(state => state.accessToken);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const url = `http://localhost:8080/trips/my`;

    const fetchMyTrips = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || `Request failed with status ${response.status}`);
        }

        setTrips(data.response);
        setError(null);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false);
      }
    };

    fetchMyTrips();
  }, [accessToken]);


  return (
    <div className="px-6 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          My Trips
        </h1>
      </div>

      {/* Content Area */}
      <div className="min-h-[65vh]">

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
              <h2 className="font-semibold mb-1">
                Something went wrong
              </h2>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && trips.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">

            {/* Lottie placeholder */}
            <div className="w-72 h-72 bg-gray-200 rounded-2xl mb-8" />

            <h2 className="text-2xl font-semibold mb-2">
              No trips yet
            </h2>

            <p className="text-gray-500 max-w-sm">
              Start planning your next adventure and create your first trip.
            </p>

          </div>
        )}

        {/* Grid State */}
        {!loading && !error && trips.length > 0 && (
          <TripsGrid
            trips={trips}
            columns={3}
          />
        )}
      </div>
    </div>
  );
};