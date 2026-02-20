import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateActivityForm } from "../components/forms/CreateActivityForm";
import { useTripStore } from "../stores/TripStore";
import { MainBtn } from "../components/buttons/MainBtn";
import { useAuthStore } from "../stores/AuthStore";


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
    destination: string,
    days: DayInterface[],
    creator: string,
    isPublic: boolean,
    starredBy: string[];
  }

  const { id: tripId } = useParams(); // Retrieve trip ID from the url
  const accessToken = useAuthStore(state => state.accessToken);
  const [error, setError] = useState(false);
  const [trip, setTrip] = useState<TripInterFace | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [dayId, setDayId] = useState<string | null>(null);
  const updateData = useTripStore(state => state.updateData);
  const setUpdateData = useTripStore(state => state.setUpdateData);
  const resetUpdateData = useTripStore(state => state.resetUpdateData);


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

      } catch (err) {
        console.log("Fetch error:", err);
        setError(true);
        //TO DO: Display proper error message for the user
      }
      finally {
      resetUpdateData(); // Reset the store value for
      }
    }
    fetchTrip();
  }, [updateData]);

  const clickToAddActivity = (dayId: string) => { 
    setDayId(dayId);
    setShowForm(true);
  };

  const removeDay = async (dayId: string) => { 
    const url = `http://localhost:8080/trips/${tripId}/days/${dayId}`; // Replace with deployed API link 
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      setUpdateData();

    } catch (err) { 
      console.log("Fetch error:", err);
    }
  };


    const addDay = async () => { 
    const url = `http://localhost:8080/trips/${tripId}/days`; // Replace with deployed API link 
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      setUpdateData();

    } catch (err) { 
      console.log("Fetch error:", err);
    }
  };


  const removeActivity = async (dayId: string, activityId: string) => { 
    const url = `http://localhost:8080/trips/${tripId}/days/${dayId}/activities/${activityId}`; // Replace with deployed API link 
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      setUpdateData();

    } catch (err) { 
      console.log("Fetch error:", err);
    }
  };

  return (
    <>
      {trip && showForm === false && 
      <div className="text-center flex flex-col items-center">
        <h1>My {trip.destination} Trip</h1>
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-12 p-8">
          {trip.days.map((day: DayInterface) => (
            <div>
            <h2 className="self-center">Day {day.dayNumber}</h2>

            <div key={day.dayNumber} className="flex flex-col w-max-349 h-max-786 p-8 mx-12 rounded-[14px] shadow-md md:mx-0">
              <div className="flex flex-col w-full justify-evenly">
                <button onClick={() => removeDay(day._id)} className="self-end cursor-pointer text-xl">x</button>
              </div>  
              <div className="flex flex-col md:items-stretch gap-2 my-4">
                  <h3>Activities</h3>
                  {day.activities.map((activity: ActivityInterface, index) => (
                    <div key={index} className="flex flex-col gap-2 shadow-sm p-4 items-start">
                      <button onClick={() => removeActivity(day._id, activity._id)} className="self-end cursor-pointer">x</button>
                      {activity.name && <h4><b>Name:</b> {activity.name}</h4>}
                      {activity.description && <p><b>Description:</b> {activity.description}</p>}
                      {activity.category && <p><b>Category:</b> {activity.category}</p>}
                      {activity.time && <p><b>Time:</b> {activity.time}</p>}
                      {activity.googleMapLink &&
                        <a href={activity.googleMapLink} target="_blank" className="outline outline-[#837E7E] p-1 rounded-lg">
                          Google Map Link
                        </a>
                      }
                    </div>
                  ))}
              </div>
              <div className="flex justify-center">
                <div>
                  <MainBtn onClick={() => clickToAddActivity(day._id)}>Add activity</MainBtn>
                </div>
              </div>
            </div>
            </div>
          ))}
          </div>
          <div>
            <MainBtn onClick={addDay}>Add day</MainBtn>
          </div>
      </div>
    }
      {showForm && dayId && tripId && (
        <CreateActivityForm
          tripId={tripId} // TO DO: fix TS error
          dayId={dayId}
          setShowForm={setShowForm}
        />
      )}
    </>
  )
};