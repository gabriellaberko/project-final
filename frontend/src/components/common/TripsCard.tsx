import { TripCardProps } from "../../types/interfaces";
import { useAuthStore } from "../../stores/AuthStore";
import { useTripStore } from "../../stores/TripStore";
import { StarBtn } from "../buttons/StarBtn";
import { useTripPermissions } from "../hooks/useTripPermissions";


export const TripCard = ({ trip }: TripCardProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { isTripCreator, isStarredByUser } = useTripPermissions(trip);
  const userId = useAuthStore(state => state.userId);

  const starTrip = useTripStore(state => state.starTrip); 
  const unstarTrip = useTripStore(state => state.unstarTrip); 
  console.log('isTripCreator:', isTripCreator, 'creator._id:', trip.creator._id, 'userId:', userId);
console.log(trip.creator)

  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 h-44 flex flex-col justify-center text-center cursor-pointer hover:shadow-lg transition"
    >
      {isAuthenticated && !isTripCreator &&
        (
        isStarredByUser
          ? <StarBtn onClick={() => unstarTrip(trip._id)} isStarredByUser={isStarredByUser} />
          : <StarBtn onClick = { () => starTrip(trip._id)} isStarredByUser={isStarredByUser} />
        )
      }   
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
