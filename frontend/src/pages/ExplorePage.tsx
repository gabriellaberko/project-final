import { useState, useEffect } from "react"
import { useAuthStore } from "../stores/AuthStore";
import { TripsGrid } from "../components/common/TripsGrid";
import { SearchBar } from "../components/common/SearchBar";


export const ExplorePage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const accessToken = useAuthStore(state => state.accessToken);

  const url = `http://localhost:8080/trips`;

  const fetchPublicTrips = async (destination?: string) => {
    try {
      setLoading(true);
      setError(null);

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
      setError(err instanceof Error ? err.message : "Something went wrong");
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

      {/* Error */}
      {!loading && error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && trips.length > 0 && (
        <TripsGrid
          trips={trips}
          columns={4}
        />
      )}
    </div>
  );
};