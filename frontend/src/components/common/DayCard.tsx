import { useNavigate } from "react-router-dom";
import { useTripStore } from "../../stores/TripStore";
import { MainBtn } from "../buttons/MainBtn";
import { DayCardProps } from "../../types/interfaces";


export const DayCard = ({ day }: DayCardProps) => {
  const navigate = useNavigate();
  const trip = useTripStore(state => state.trip);
  const removeDay = useTripStore(state => state.removeDay);
  const removeActivity = useTripStore(state => state.removeActivity);

  return (
    <>
      <div className="text-center flex flex-col items-center">
        <div>
          <h2 className="self-center">Day {day.dayNumber}</h2>
          <div key={day.dayNumber} className="flex flex-col w-max-349 h-max-786 p-8 mx-12 rounded-[14px] shadow-md md:mx-0">
            <div className="flex flex-col w-full justify-evenly">
              <button onClick={() => removeDay(trip!._id, day._id)} className="self-end cursor-pointer text-xl">x</button>
            </div>  
            <div className="flex flex-col md:items-stretch gap-2 my-4">
                <h3>Activities</h3>
                {day.activities.map((activity, index) => (
                  <div key={index} className="flex flex-col gap-2 shadow-sm p-4 items-start">
                    <button onClick={() => removeActivity(trip!._id, day._id, activity._id)} className="self-end cursor-pointer">x</button>
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
                <MainBtn onClick={() => navigate(`/trips/${trip!._id}/day/${day._id}/activities/new`)}>Add activity</MainBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};