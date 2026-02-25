import { TripCardProps } from "../../types/interfaces";


export const TripCard = ({ trip, showPrivacy }: TripCardProps) => {
  return (
    <div
      className="relative bg-white rounded-xl shadow-md p-4 h-44 flex flex-col justify-center text-center cursor-pointer hover:shadow-lg transition"
    >
      {showPrivacy && (
        <span className="absolute top-3 right-3 text-xl">
          {trip.isPublic ? "🌍" : "🔒"}
        </span>
      )}
      {trip.tripName?.trim() && (
        <p className="text-xs text-gray-400 uppercase mb-1">
          {trip.tripName}
        </p>
      )}

      <h3 className="text-lg font-semibold">
        {trip.destination}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {trip.days.length} {trip.days.length === 1 ? "day" : "days"}
      </p>

    </div>
  );
};
