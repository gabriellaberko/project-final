import { DayCard } from "./DayCard";
import { Link } from "react-router-dom";
import { useTripStore } from "../../stores/TripStore";
import { useAuthStore } from "../../stores/AuthStore";
import { MainBtn } from "../buttons/MainBtn";
import { DayGridProps } from "../../types/interfaces";


export const DayGrid = ({ columns = 4 }: DayGridProps) => {
  const trip = useTripStore(state => state.trip);
  const addDay = useTripStore(state => state.addDay);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const gridClass =
    columns === 4
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-visible"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible";

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
    </>
  )
};
