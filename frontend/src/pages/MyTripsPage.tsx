import { useEffect } from "react";
import { useAuthStore } from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import { TripsGrid } from "../components/common/TripsGrid";
import { MainBtn } from "../components/buttons/MainBtn";
import { useTripStore } from "../stores/TripStore";
import { LoadingState } from "../components/status/LoadingState";
import { ErrorState } from "../components/status/ErrorState";
import { EmptyState } from "../components/status/EmptyState";


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
      <div className="flex justify-center md:justify-start items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          My Trips
        </h1>
      </div>

      {/* Content Area */}
      <div className="min-h-[65vh]">

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Error State */}
        {!loading && error && 
          <ErrorState text="Couldn't load your trips. Please try again in a moment." />
        }

        {/* Empty State */}
        {!loading && !error && trips && trips.length === 0 &&
          <EmptyState headline="No trips yet" text="Start planning your next adventure and create your first trip." />
        }

        {/* Grid State */}
        {!loading && !error && trips && trips.length > 0 && (
          <TripsGrid
            trips={trips}
            columns={3}
            showPrivacy={true}
          />
        )}

              <div className="flex justify-center md:justify-start">
        <MainBtn
          onClick={() => navigate("/trips/new")}
          className="my-10"
        >
          Create a new trip
        </MainBtn>
      </div>
      </div>
    </div>
  );
};