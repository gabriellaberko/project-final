import { TripCardProps } from "../../types/interfaces";
import { useTripStore } from "../../stores/TripStore";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";
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

        {/* DESCRIPTION */}
        <div className="relative">
          <p className="text-sm text-gray-600 leading-relaxed mt-2 line-clamp-3">
            {trip.description}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-white to-transparent" />
        </div>

        <div className="mt-4">
          <span className="px-4 py-1 border rounded-lg text-sm text-gray-600">
            {trip.days.length}{" "}
            {trip.days.length === 1 ? "day" : "days"}
          </span>
        </div>

      </div>

      <Trash 
        onClick={handleDelete}
        className="absolute bottom-4 right-4 text-[#505050] hover:text-red-500 cursor-pointer" />
    </div>
  );
};