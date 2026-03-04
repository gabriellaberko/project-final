import { TripCardProps } from "../../types/interfaces";
import { useTripStore } from "../../stores/TripStore";
import { useNavigate } from "react-router-dom";
import { Trash, Calendar } from "lucide-react";
import { useAuthStore } from "../../stores/AuthStore";

export const MyTripCard = ({ trip }: TripCardProps) => {
  const navigate = useNavigate();
  const removeTrip = useTripStore(state => state.removeTrip);
  const { accessToken } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleCardClick = () => {
    navigate(`/trips/${trip._id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const response = await fetch(`${API_URL}/trips/${trip._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        removeTrip(trip._id);
      } else {
        console.error("Failed to delete trip");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="
      relative bg-white rounded-xl
      shadow-md hover:shadow-lg transition
      flex flex-col
      overflow-hidden
      cursor-pointer
      "
    >

      {trip.imageUrl && (
        <div className="w-full h-46">
          <img
            src={trip.imageUrl}
            alt={trip.destination}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Privacy tag top right */}
      <span className="absolute top-4 right-4 text-xs px-3 py-1 bg-white rounded-full shadow-sm">
        {trip.isPublic ? "Public" : "Private"}
      </span>

      {/* content */}
      <div className="p-6 pb-8 flex flex-col justify-between h-45">
        <div>
          <h3 className="text-lg font-semibold">
            {trip.destination}
          </h3>

          {/* DESCRIPTION */}
          {trip.description && (
            <div className="relative mt-2">
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {trip.description}
              </p>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white to-transparent" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={14} className="text-gray-400" />
          <span>
            {trip.days.length}{" "}
            {trip.days.length === 1 ? "day" : "days"}
          </span>
        </div>

        <Trash
          onClick={handleDelete}
          className="absolute bottom-4 right-4 text-[#505050] hover:text-red-500 cursor-pointer" />
      </div>
    </div>
  );
};