import { TripInterFace } from "../../types/interfaces";
import star from "../../assets/star-filled.svg";
import Avatar from "../../assets/avatar.png";

export const PublicTripCard = ({ trip }: { trip: TripInterFace }) => {

  return (
    <>
    <div
      className="
        group
        bg-white
        rounded-2xl
        shadow-md
        overflow-hidden
        flex
        flex-col
      "
        >
    
          {/* IMAGE */}
          <div className="w-full">
            <img
              src={trip.imageUrl}
              alt={trip.destination}
              className="
            w-full
            h-48
            object-cover
          "
            />
          </div>
    
          {/* CONTENT */}
          <div className="p-6 flex flex-col grow">
    
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
    
                <div className="shrink-0">
                  <img
                    src={star}
                    alt="Star Icon"
                    className="w-5 h-5"
                  />
                </div>
            </div>
    
            {/* PUSH FOOTER DOWN */}
            <div className="flex items-center justify-between gap-3">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 shrink-0">
                {trip.days.length}{" "}
                {trip.days.length === 1 ? "day" : "days"}
              </span>
    
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={trip.creator?.avatarUrl || Avatar}
                  alt="Profile picture"
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <span className="text-sm text-gray-500 truncate">
                  {trip.creator?.userName}
                </span>
              </div>
            </div>
    
          </div>
        </div>
    </>
  )
}
