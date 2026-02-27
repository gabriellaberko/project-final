// import { TripCardProps } from "../../types/interfaces";
// import { TripInterFace } from "../../types/interfaces";
// import { useAuthStore } from "../../stores/AuthStore";
// import { useTripStore } from "../../stores/TripStore";
// import { StarBtn } from "../buttons/StarBtn";
// import { useTripPermissions } from "../hooks/useTripPermissions";


// export const TripCard = ({ trip, showPrivacy }: TripCardProps) => {
//   const isAuthenticated = useAuthStore(state => state.isAuthenticated);
//   const { isTripCreator, isStarredByUser } = useTripPermissions(trip);
//   const userId = useAuthStore(state => state.userId);

//   const starTrip = useTripStore(state => state.starTrip);
//   const unstarTrip = useTripStore(state => state.unstarTrip);


//   return (
//     <div
//       className="relative bg-white rounded-xl shadow-md p-4 h-44 flex items-center justify-center text-center cursor-pointer hover:shadow-lg transition"
//     >
//       {showPrivacy && (
//         <span className="absolute top-3 left-3 text-xl">
//           {trip.isPublic ? "🌍" : "🔒"}
//         </span>
//       )}
//       {isAuthenticated && !isTripCreator && (
//         <div className="absolute top-3 right-3">
//           {isStarredByUser ? (
//             <StarBtn
//               onClick={() => unstarTrip(trip._id)}
//               isStarredByUser={isStarredByUser}
//             />
//           ) : (
//             <StarBtn
//               onClick={() => starTrip(trip._id)}
//               isStarredByUser={isStarredByUser}
//             />
//           )}
//         </div>
//       )}

//       <div className="flex flex-col items-center justify-center">
//         {trip.tripName?.trim() && (
//           <p className="text-xs text-gray-400 uppercase mb-1">
//             {trip.tripName}
//           </p>
//         )}

//         <h3 className="text-lg font-semibold">
//           {trip.destination}
//         </h3>

//         <p className="text-sm text-gray-500 mt-1">
//           {trip.days.length} {trip.days.length === 1 ? "day" : "days"}
//         </p>
//       </div>
//     </div>
//   )
// };
