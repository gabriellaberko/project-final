import { TripCardProps } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";

export const MyTripCard = ({ trip }: TripCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/trips/${trip._id}`);
  };

  return (
    <div className="
      relative bg-white rounded-xl
      shadow-md hover:shadow-lg transition
      h-48 flex items-center justify-center
      cursor-pointer
    "
      onClick={handleCardClick}>

      {/* Privacy tag top right */}
      <span className="absolute top-4 right-4 text-xs px-3 py-1 bg-white rounded-full shadow-sm">
        {trip.isPublic ? "Public" : "Private"}
      </span>

      {/* Centered content */}
      <div className="text-center">

        {trip.tripName && (
          <p className="text-xs text-gray-400 uppercase mb-1">
            {trip.tripName}
          </p>
        )}

        <h3 className="text-xl font-semibold">
          {trip.destination}
        </h3>

        <div className="mt-4">
          <span className="px-4 py-1 border rounded-lg text-sm text-gray-600">
            {trip.days.length}{" "}
            {trip.days.length === 1 ? "day" : "days"}
          </span>
        </div>

      </div>
    </div>
  );
};