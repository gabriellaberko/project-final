import { useNavigate } from "react-router-dom";
import { useTripStore } from "../../stores/TripStore";
import { MainBtn } from "../buttons/MainBtn";
import { DayCardProps } from "../../types/interfaces";
import { useTripPermissions } from "../hooks/useTripPermissions";
import { useAuthStore } from "../../stores/AuthStore";
import { Activity } from "../common/Activity"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Trash } from "lucide-react"
import Card from "@mui/joy/Card"

export const DayCard = ({ day }: DayCardProps) => {
  const navigate = useNavigate();
  const trip = useTripStore(state => state.trip);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { isTripCreator } = useTripPermissions(trip);
  const removeDay = useTripStore(state => state.removeDay);
  const { setNodeRef, isOver } = useDroppable({
    id: day._id,
    data: {
      dayId: day._id,
      type: "day",
    },
  })

  if (!trip) return null;

  return (
    <>
    <div className="text-center flex flex-col items-center w-full">
        <h2 className="self-center m-2">Day {day.dayNumber}</h2>
        <div className="w-full flex justify-center">

          <div
            ref={setNodeRef}
            className={[
              "w-full max-w-87.25 min-h-62.5 overflow-visible",
              isOver ? "ring-2 ring-blue-300 rounded-xl" : "",
            ].join(" ")}
          >
            <Card
              key={day.dayNumber} 
              className="flex flex-col w-full h-full h-max-786 p-8 shadow-md overflow-visible"
            >
            <div className="flex flex-col w-full justify-evenly">
              {isAuthenticated && isTripCreator &&
                <Trash
                  onClick={() => removeDay(trip._id, day._id)} 
                  className="self-end cursor-pointer text-lg text-[#505050] hover:text-red-500"
                />
              }
            </div>  

            <div className="flex flex-col md:items-stretch gap-2 my-4 min-h-16 flex-1 w-full">
              <SortableContext
                items={day.activities.map((activity) => activity._id)}
                strategy={verticalListSortingStrategy}
              >

              {day.activities.length > 0 ? (
                day.activities.map((activity, index) => (
                  <Activity 
                    key={activity._id} 
                    tripId={trip._id} 
                    dayId={day._id} 
                    index={index}
                    activity={activity}
                  />
                ))
              ) : (
                <p>No activities yet</p>
              )}
              </SortableContext>
            </div>

            <div className="mt-auto flex justify-center">
            {isAuthenticated && isTripCreator &&
              <div>
                <MainBtn onClick={() => navigate(`/trips/${trip._id}/day/${day._id}/activities/new`)}>Add activity</MainBtn>
              </div>
            }
            </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
};
