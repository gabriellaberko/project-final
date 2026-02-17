import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const TripDetailsPage = () => {

  interface ActicityInterface {
    name: string,
    description: string,
    category: string,
    time: string,
    googleMapLink: string
  };

  interface DayInterface {
  dayNumber: number,
  activities: [ActicityInterface]
  };

  interface TripInterFace { 
    tripName: string,
    destination: string,
    days: DayInterface[],
    creator: string,
    isPublic: boolean,
    starredBy: string[];
  }

  const { id: tripId } = useParams(); // Retrieve trip ID from the url
  const [error, setError] = useState(false);
  const [trip, setTrip] = useState<TripInterFace | null>(null);

  // TO DO: Fetch a specific trip from API, based on the tripID
  useEffect(() => {
    const fetchTrip = async () => {
      const url = `http://localhost:8080/trips/${tripId}`; // Replace with deployed API link 
      try {
        const response = await fetch(url);

        if (!response.ok) { 
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const fetchedTrip = await response.json();
        setTrip(fetchedTrip.response);
        console.log(fetchedTrip.response);
        console.log(trip)


      } catch (err) {
        console.log("Fetch error:", error);
        setError(true);
        //TO DO: Display proper error message for the user
      }
    }
    fetchTrip();
  }, [])

  return (
    <>
    {trip && 
      <>
        <h1>{trip.destination}</h1>
        {trip.days.map((day: DayInterface) => (
          <div key={day.dayNumber}>
            <h2>Day {day.dayNumber}</h2>
            <h3>Activities:</h3>
            {day.activities.map((activity: ActicityInterface, index) => (
              <div key={index}>
                {activity.name && <h4>{activity.name}</h4>}
                {activity.description && <p>{activity.description}</p>}
                {activity.category && <p>{activity.category}</p>}
                {activity.time && <p>{activity.time}</p>}
                {activity.googleMapLink && <p>{activity.googleMapLink}</p>}
              </div>
            ))}
          </div>
        ))}
      </>
    }
    
    </>
  )
};