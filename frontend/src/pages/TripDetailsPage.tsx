import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const TripDetailsPage = () => {

  const { id: tripId } = useParams(); // Retrieve trip ID from the url

  // TO DO: Fetch a specific trip from API, based on the tripID
  useEffect(() => {
    const fetchTrip = async () => {
      try {

      } catch (err) {
        
      }
    }
  }, [])

  return (
    <>
    </>
  )
};