import { useNavigate } from "react-router-dom";
import { useTripStore } from "../../stores/TripStore";
import { MainBtn } from "../buttons/MainBtn";
import { DayCardProps } from "../../types/interfaces";
import { useAuthStore } from "../../stores/AuthStore";
import { ActivityCard } from "./ActivityCard"
import { useDroppable } from "@dnd-kit/react";
import Card from "@mui/joy/Card"

export const DayCard = ({ day }: DayCardProps) => {
  const navigate = useNavigate();
  const trip = useTripStore(state => state.trip);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isTripCreator = useTripStore(state => state.getIsTripCreator());
  const removeDay = useTripStore(state => state.removeDay);
  const { ref, isDropTarget } = useDroppable({
    id: day._id,
  })

  if (!trip) return null;

  return (
    <>
      <div className="text-center flex flex-col items-center">
        <div>
          <h2 className="self-center m-2">Day {day.dayNumber}</h2>

          <Card
            ref={ref}
            key={day.dayNumber} 
            className={[
              "flex flex-col w-max-349 h-max-786 p-8 mx-12 shadow-md md:mx-0",
              isDropTarget ? "ring-2 ring-blue-300" : "",
            ].join(" ")}
          >
            <div className="flex flex-col w-full justify-evenly">
              {isAuthenticated && isTripCreator &&
                <button 
                  onClick={() => removeDay(trip._id, day._id)} 
                  className="self-end cursor-pointer text-xl"
                >
                  x
                </button>
              }
            </div>  

            <div className="flex flex-col md:items-stretch gap-2 my-4">

                  {day.activities.length > 0 ? (
                    day.activities.map((activity) => (
                      <ActivityCard 
                        key={activity._id} 
                        tripId={trip._id} 
                        dayId={day._id} 
                        activity={activity}
                      />
                    ))
                  ) : (
                    <p>No activities yet</p>
                  )}
            </div>

            <div className="flex justify-center">
            {isAuthenticated && isTripCreator &&
              <div>
                <MainBtn onClick={() => navigate(`/trips/${trip._id}/day/${day._id}/activities/new`)}>Add activity</MainBtn>
              </div>
            }
            </div>
          </Card>
        </div>
      </div>
    </>
  )
};
