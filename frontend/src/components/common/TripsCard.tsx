interface TripCardProps {
  trip: {
    _id: string,
    destination: string;
    tripName?: string;
    days: any[];
  };
  onClick?: () => void;
}

export const TripCard = ({ trip }: TripCardProps) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 h-44 flex flex-col justify-center text-center cursor-pointer hover:shadow-lg transition"
    >
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
