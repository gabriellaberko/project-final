import { useTripStore } from "../../stores/TripStore";
import { useAuthStore } from "../../stores/AuthStore";
import { ActivityInterface } from "../../types/interfaces";
import { ActivityIcon } from "./ActivityIcons"

import Card from "@mui/joy/Card"

interface ActivityProps {
  tripId: string;
  dayId: string;
  activity: ActivityInterface;
}

export const Activity = ({ tripId, dayId, activity }: ActivityProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const removeActivity = useTripStore(state => state.removeActivity)


  return (
    <>
      <Card className="shadow-sm m-1">
          <div className="flex flex-row justify-between gap-2">
            <div className="flex flex-row items-center">
              <div>
                <ActivityIcon
                  category={activity.category}
                  size={28}
                  className="text-blue-600"
                />
              </div>

              <div className="flex flex-col gap-2 p-4 items-start text-left">
                {activity.name && <h4>{activity.name}</h4>}
                {activity.description && <p>{activity.description}</p>}
                {activity.time && <p><b>Time:</b> {activity.time}</p>}
                {activity.googleMapLink &&
                  <a 
                    href={activity.googleMapLink} 
                    target="_blank" 
                    className="text-sm outline outline-[#837E7E] px-3 py-1 rounded-lg cursor-pointer"
                  >
                    Google Map Link
                  </a>
                }
              </div>
            </div>

            {isAuthenticated &&
              <button 
                onClick={() => removeActivity(tripId, dayId, activity._id)}
                className="self-start cursor-pointer"
              >
                🗑️
              </button>
            }
          </div>         
      </Card>
    </>
  )
}
