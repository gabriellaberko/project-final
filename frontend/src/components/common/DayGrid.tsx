import { DayCard } from "./DayCard";
import { Link } from "react-router-dom";
import { useTripStore } from "../../stores/TripStore";
import { MainBtn } from "../buttons/MainBtn";


interface DayGridProps {
  columns?: 3 | 4;
}

export const DayGrid = ({ columns = 4 }: DayGridProps) => {
  const trip = useTripStore(state => state.trip);
  const addDay = useTripStore(state => state.addDay);

  const gridClass =
    columns === 4
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <>
    <div className={gridClass}>
      {trip!.days.map((day) => (
          <DayCard
            key={day._id}
            day={day}
          />
      ))}
    </div>
    <div>
      <MainBtn onClick={() => addDay(trip!._id)}>Add day</MainBtn>
      </div>
    </>
  )
};
