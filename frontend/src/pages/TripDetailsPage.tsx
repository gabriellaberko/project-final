import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateActivityForm } from "../components/forms/CreateActivityForm";
import { useTripStore } from "../stores/TripStore";


export const TripDetailsPage = () => {

  interface ActivityInterface {
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
    destination: string,
    days: DayInterface[],
    creator: string,
    isPublic: boolean,
    starredBy: string[];
  }

  const { id: tripId } = useParams(); // Retrieve trip ID from the url
  const [error, setError] = useState(false);
  const [trip, setTrip] = useState<TripInterFace | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [dayId, setDayId] = useState<string | null>(null);
  const updateData = useTripStore(state => state.updateData);

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
        console.log(trip)

      } catch (err) {
        console.log("Fetch error:", error);
        setError(true);
        //TO DO: Display proper error message for the user
      }
    }
    fetchTrip();
  }, [updateData]);

  const clickToAddActivity = (dayId: string) => { 
    setDayId(dayId);
    setShowForm(true);
  };

  return (
    <>
    {trip && showForm === false && 
      <>
        <h1>{trip.destination}</h1>
        {trip.days.map((day: DayInterface) => (
          <div key={day.dayNumber}>
            <h2>Day {day.dayNumber}</h2>
            <h3>Activities:</h3>
            {day.activities.map((activity: ActivityInterface, index) => (
              <div key={index}>
                {activity.name && <h4>{activity.name}</h4>}
                {activity.description && <p>{activity.description}</p>}
                {activity.category && <p>{activity.category}</p>}
                {activity.time && <p>{activity.time}</p>}
                {activity.googleMapLink && <a href={activity.googleMapLink} target="_blank">Google Map Link</a>}
              </div>
            ))}
            <button onClick={() => clickToAddActivity(day._id)}>Add activity</button>
          </div>
        ))}
      </>
    }
      {showForm && dayId && (
        <CreateActivityForm
          tripId={tripId} // TO DO: fix TS error
          dayId={dayId}
          setShowForm={setShowForm}
        />
      )}
    </>
  )
};