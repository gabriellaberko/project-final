import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTripStore } from "../stores/TripStore";
import { MainBtn } from "../components/buttons/MainBtn";
import { useAuthStore } from "../stores/AuthStore";
import { DayGrid } from "../components/common/DayGrid";


export const TripDetailsPage = () => {

  interface ActivityInterface {
    _id: string,
    name: string,
    description: string,
    category: string,
    time: string,
    googleMapLink: string
  };

  interface DayInterface {
  _id: string,
  dayNumber: number,
  activities: [ActivityInterface]
  };

  interface TripInterFace { 
    tripName: string,
    _id: string,
    destination: string,
    days: DayInterface[],
    creator: string,
    isPublic: boolean,
    starredBy: string[];
  }

  const API_URL = import.meta.env.VITE_API_URL;
  const { id: tripId } = useParams(); // Retrieve trip ID from the url
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const { trip, setTrip } = useTripStore();
  const updateData = useTripStore(state => state.updateData);
  const setUpdateData = useTripStore(state => state.setUpdateData);
  const resetUpdateData = useTripStore(state => state.resetUpdateData);


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
        setLoading(false);

      } catch (err) {
        console.log("Fetch error:", err);
        setLoading(false);
        setError(true);
        //TO DO: Display proper error message for the user
      }
      finally {
      resetUpdateData(); // Reset the store value for updateData
      
      }
    }
    fetchTrip();
  }, [updateData]);



  return (
    <>
      {trip &&
      <div className="text-center flex flex-col items-center">
        <h1>My {trip.destination} Trip</h1>
          {/* Grid State */}
          {!loading && !error && trip && (
            <DayGrid
              columns={3}
            />
          )}
      </div>
      }
    </>
  )
};