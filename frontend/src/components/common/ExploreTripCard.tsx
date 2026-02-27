import { TripCardProps } from "../../types/interfaces";
import { useTripPermissions } from "../hooks/useTripPermissions";
import { useTripStore } from "../../stores/TripStore";
import { StarBtn } from "../buttons/StarBtn";
import { useAuthStore } from "../../stores/AuthStore";
import { useNavigate } from "react-router-dom";


export const ExploreTripCard = ({ trip }: TripCardProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { isStarredByUser, isTripCreator } = useTripPermissions(trip);
  const starTrip = useTripStore(state => state.starTrip);
  const unstarTrip = useTripStore(state => state.unstarTrip);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/trips/${trip._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md flex h-64 overflow-hidden hover:shadow-lg transition cursor-pointer"
      onClick={handleCardClick}>

      <div className="relative p-6 w-3/5 flex flex-col justify-between">
        {isAuthenticated && !isTripCreator && (
          <div className="absolute top-3 right-3">
            {isStarredByUser ? (
              <StarBtn
                onClick={() => unstarTrip(trip._id)}
                isStarredByUser={isStarredByUser}
              />
            ) : (
              <StarBtn
                onClick={() => starTrip(trip._id)}
                isStarredByUser={isStarredByUser}
              />
            )}
          </div>
        )}


        {/* LEFT SIDE */}
        <div className="p-6 w-3/5 flex flex-col justify-between">

          <div>
            <h3 className="text-2xl font-semibold">
              {trip.destination}
            </h3>

            {trip.tripName && (
              <p className="text-sm text-gray-400 mt-1">
                {trip.tripName}
              </p>
            )}

            <p className="text-sm text-gray-600 mt-4 line-clamp-3">
              Description text text text text text
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="px-4 py-1 border rounded-lg text-sm text-gray-600">
              {trip.days.length}{" "}
              {trip.days.length === 1 ? "day" : "days"}
            </span>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-500">
                {trip.creator?.userName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-2/5 relative">
        <img
          src={trip.imageUrl}
          alt={trip.destination}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};