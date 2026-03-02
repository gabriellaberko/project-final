import { useEffect } from "react";
import { useAuthStore } from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import { TripsGrid } from "../components/common/TripsGrid";
import { MainBtn } from "../components/buttons/MainBtn";
import { useTripStore } from "../stores/TripStore";


export const MyTripsPage = () => {
  const fetchMyTrips = useTripStore(state => state.fetchMyTrips);
  const trips = useTripStore(state => state.trips);
  const loading = useTripStore(state => state.loading);
  const error = useTripStore(state => state.error);
  const updateData = useTripStore(state => state.updateData);
  const accessToken = useAuthStore(state => state.accessToken);
  const navigate = useNavigate();


  useEffect(() => {
    if (!accessToken) return;
    fetchMyTrips();
  }, [accessToken, updateData])


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
                Error
              </h2>
              <p className="text-sm">Something went wrong</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && trips && trips.length === 0 && (
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
        {!loading && !error && trips && trips.length > 0 && (
          <TripsGrid
            trips={trips}
            columns={3}
            showPrivacy={true}
          />
        )}

        <MainBtn
          onClick={() => navigate("/trips/new")}
        >
          Create a new trip
        </MainBtn>
      </div>
    </div>
  );
};