import { TripCardProps } from "../../types/interfaces";
import { useTripPermissions } from "../hooks/useTripPermissions";
import { useTripStore } from "../../stores/TripStore";
import { StarBtn } from "../buttons/StarBtn";
import { useAuthStore } from "../../stores/AuthStore";
import { useNavigate } from "react-router-dom";


export const ExploreTripCard = ({ trip, variant = "vertical" }: TripCardProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { isStarredByUser, isTripCreator } = useTripPermissions(trip);
  const starTrip = useTripStore(state => state.starTrip);
  const unstarTrip = useTripStore(state => state.unstarTrip);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/trips/${trip._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        group
        bg-white
        rounded-2xl
        shadow-md
        hover:shadow-xl
        transition-all
        duration-300
        cursor-pointer
        overflow-hidden
         ${variant === "horizontal"
          ? "flex flex-col md:flex-row md:h-80"
          : "flex flex-col"
        }
      `}
    >

      {/* IMAGE */}
      <div className={`
         ${variant === "horizontal"
          ? "w-full md:w-5/12 md:order-2"
          : "w-full"
        }
      `}>
        <img
          src={trip.imageUrl}
          alt={trip.destination}
          className={`
            w-full
            object-cover
            ${variant === "horizontal" ? "h-56 md:h-full" : "h-48"}
          `}
        />
      </div>

      {/* CONTENT */}
      <div className={`
        p-6
        flex
        flex-col
        ${variant === "horizontal" ? "md:w-7/12 md:order-1" : "grow"}
       `}
      >

        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className="
          text-lg
          font-semibold
          text-gray-900
          wrap-break-word
        "
          >
            {trip.destination}
          </h3>

          {isAuthenticated && !isTripCreator && (
            <div className="shrink-0 flex items-center gap-2">
              <StarBtn
                onClick={
                  isStarredByUser
                    ? () => unstarTrip(trip._id)
                    : () => starTrip(trip._id)
                }
                isStarredByUser={isStarredByUser}
              />
              <span className="text-sm text-gray-500 font-medium">
                {trip.starredBy?.length || 0}
              </span>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 leading-relaxed mt-4 line-clamp-3">
          Description text text text text text
        </p>

        {/* PUSH FOOTER DOWN */}
        <div className="mt-auto pt-6 flex items-center justify-between gap-3">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 shrink-0">
            {trip.days.length}{" "}
            {trip.days.length === 1 ? "day" : "days"}
          </span>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 bg-gray-200 rounded-full shrink-0" />
            <span className="text-sm text-gray-500 truncate">
              {trip.creator?.userName}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

// TODO: Fix the design.
// TODO: Fix what to show here, more than x likes? 