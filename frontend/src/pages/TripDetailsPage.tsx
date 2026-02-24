import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTripStore } from "../stores/TripStore";
import { DayGrid } from "../components/common/DayGrid";
import { StarBtn } from "../components/buttons/StarBtn";
import { useAuthStore } from "../stores/AuthStore";


export const TripDetailsPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id: tripId } = useParams(); // Retrieve trip ID from the url
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const { trip, setTrip } = useTripStore();
  const updateData = useTripStore(state => state.updateData);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isTripCreator = useTripStore(state => state.isTripCreator); 
  const isStarredByUser = useTripStore(state => state.isStarredByUser);
  const setIsStarredByUser = useTripStore(state => state.setIsStarredByUser);
  const starTrip = useTripStore(state => state.starTrip); 
  const unstarTrip = useTripStore(state => state.unstarTrip); 


  useEffect(() => {
    const fetchTrip = async () => {
      const url = `${API_URL}/trips/${tripId}`; // Replace with deployed API link 
      // Set loading state
      setLoading(true);
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const fetchedTrip = await response.json();
        setTrip(fetchedTrip.response);
        setIsStarredByUser();
        setLoading(false);

      } catch (err) {
        console.log("Fetch error:", err);
        setLoading(false);
        setError(true);
        //TO DO: Display proper error message for the user
      }
    }
    fetchTrip();
  }, [updateData]);



  return (
    <>
      {/* TO DO: Loading & Error States */}

      {/* {loading && (
      )} */}

      {/* Error State */}
      {/* {!loading && error && (
      )} */}
        
      {trip &&
      <div className="text-center flex flex-col items-center">
        <h1>My {trip.destination} Trip</h1>
        {isAuthenticated && !isTripCreator &&
          (
          isStarredByUser
            ? <StarBtn onClick={() => unstarTrip(trip._id)} isStarredByUser={isStarredByUser} />
            : <StarBtn onClick = { () => starTrip(trip._id)} isStarredByUser={isStarredByUser} />
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