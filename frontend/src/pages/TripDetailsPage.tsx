import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTripStore } from "../stores/TripStore";
import { DayGrid } from "../components/common/DayGrid";
import { StarBtn } from "../components/buttons/StarBtn";
import { useAuthStore } from "../stores/AuthStore";
import { DragDropProvider } from "@dnd-kit/react"
import { MainBtn } from "../components/buttons/MainBtn";


export const TripDetailsPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id: tripId } = useParams(); // Retrieve trip ID from the url
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { trip, setTrip } = useTripStore();
  const updateData = useTripStore(state => state.updateData);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isTripCreator = useTripStore(state => state.getIsTripCreator());
  const isStarredByUser = useTripStore(state => state.getIsStarredByUser());
  const starTrip = useTripStore(state => state.starTrip); 
  const unstarTrip = useTripStore(state => state.unstarTrip); 
  const addDay = useTripStore(state => state.addDay);
  const moveActivity = useTripStore(state => state.moveActivity);



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

          
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled || !trip) return;

          const { source, target } = event.operation;
          if (!source || !target) return;

          const sourceData = (source as any).data as { dayId?: string } | undefined;
          const targetData = (target as any).data as { dayId?: string } | undefined;
          const sourceDayId = sourceData?.dayId ?? String((source as any).sortable?.group ?? "");
          const targetDayId = targetData?.dayId ?? String((target as any).sortable?.group ?? target.id ?? "");

          if (!sourceDayId || !targetDayId) {
            return;
          }

          const sourceDayIndex = trip.days.findIndex((day) => day._id === sourceDayId);
          const targetDayIndex = trip.days.findIndex((day) => day._id === targetDayId);
          if (sourceDayIndex < 0 || targetDayIndex < 0) return;

          const sourceIndex = (source as any).sortable?.index ?? -1;
          let targetIndex = (target as any).sortable?.index ?? -1;
          if (sourceIndex < 0) return;

          const sourceDay = trip.days[sourceDayIndex];
          const targetDay = trip.days[targetDayIndex];
          if (!sourceDay || !targetDay) return;

          const sourceActivities = [...sourceDay.activities];
          const [moved] = sourceActivities.splice(sourceIndex, 1);
          if (!moved) return;

          const targetActivities =
            sourceDayId === targetDayId ? sourceActivities : [...targetDay.activities];

          if (targetIndex < 0 || targetIndex > targetActivities.length) {
            targetActivities.push(moved);
          } else {
            targetActivities.splice(targetIndex, 0, moved);
          }

          const updatedTrip = {
            ...trip,
            days: trip.days.map((d, index) => {
              if (index === sourceDayIndex) {
                return { ...d, activities: sourceActivities };
              }
              if (index === targetDayIndex) {
                return { ...d, activities: targetActivities };
              }
              return d;
            }),
          };

          setTrip(updatedTrip);
          moveActivity(String(source.id), targetDayId)
        }}
      >
        {trip &&
        <div className="text-center flex flex-col items-center m-5">
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
      </DragDropProvider>

      {isAuthenticated &&
        <div className="flex justify-center">
          <MainBtn 
            onClick={() => addDay(trip!._id)}
            className="m-5"
          >
            Add day
          </MainBtn>
        </div>
      }
    </>
  )
};
