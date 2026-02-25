import { TripInterFace } from "../../types/interfaces";
import { useAuthStore } from "../../stores/AuthStore";


// Placed in a hook so that the variables istripCreator & isStarredByUser can be computed based on any trip (the global state trip or trip passed as a prop)
export const useTripPermissions = (trip: TripInterFace | null) => {
  const userId = useAuthStore(state => state.userId);
  
  if (!trip || !userId || !trip.creator) return { isTripCreator: false, isStarredByUser: false };

  const isTripCreator = trip.creator._id === userId;
  const isStarredByUser = trip.starredBy.some(id => id === userId);
  
  return { isTripCreator, isStarredByUser };
}