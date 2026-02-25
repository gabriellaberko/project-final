import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTripStore } from "../stores/TripStore";
import { DayGrid } from "../components/common/DayGrid";
import { StarBtn } from "../components/buttons/StarBtn";
import { useAuthStore } from "../stores/AuthStore";
import { dividerClasses } from "@mui/material/Divider";


export const TripDetailsPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id: tripId } = useParams(); // Retrieve trip ID from the url
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const { trip, setTrip } = useTripStore();
  const updateData = useTripStore(state => state.updateData);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const accessToken = useAuthStore(state => state.accessToken);
  const isTripCreator = useTripStore(state => state.getIsTripCreator());
  const isStarredByUser = useTripStore(state => state.getIsStarredByUser());
  const starTrip = useTripStore(state => state.starTrip);
  const unstarTrip = useTripStore(state => state.unstarTrip);
  const updatePrivacy = useTripStore(state => state.updatePrivacy);


  useEffect(() => {
    const fetchTrip = async () => {
      const url = `${API_URL}/trips/${tripId}`; // Replace with deployed API link 
      // Set loading state
      setLoading(true);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const fetchedTrip = await response.json();
        setTrip(fetchedTrip.response);
        setLoading(false);

      } catch (err) {
        console.log("Fetch error:", err);
        setLoading(false);
        setError(true);
        //TO DO: Display proper error message for the user
      }
    }
    fetchTrip();
  }, [updateData, accessToken, tripId]);



  return (
    <>
      {/* TO DO: Loading & Error States */}

      {/* {loading && (
      )} */}

      {/* Error State */}
      {/* {!loading && error && (
      )} */}

      {trip &&
        <div className="relative text-center flex flex-col items-center">
          <h1>My {trip.destination} Trip</h1>

          {isTripCreator && (
            <div className="absolute right-0 flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {trip.isPublic ? "Public" : "Private"}
              </span>

              <button
                onClick={() => updatePrivacy(trip._id, !trip.isPublic)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${trip.isPublic ? "bg-gray-700" : "bg-gray-300"
                  }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${trip.isPublic ? "translate-x-5" : ""
                    }`}
                />
              </button>
            </div>
          )}

          {isAuthenticated && !isTripCreator &&
            (
              isStarredByUser
                ? <StarBtn onClick={() => unstarTrip(trip._id)} isStarredByUser={isStarredByUser} />
                : <StarBtn onClick={() => starTrip(trip._id)} isStarredByUser={isStarredByUser} />
            )
          }
          {/* Grid State */}
          {!loading && !error && (
            <DayGrid
              columns={3}
            />
          )}
        </div>
      }
    </>
  )
};