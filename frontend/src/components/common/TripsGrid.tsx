// import { TripCard } from "./TripsCard";
import { MyTripCard } from "./MyTripCard";
import { ExploreTripCard } from "./ExploreTripCard";
import { Link } from "react-router-dom";
import { TripsGridProps } from "../../types/interfaces";


export const TripsGrid = ({ trips, columns = 4, showPrivacy = false }: TripsGridProps) => {

  const gridClass =
    columns === 4
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  if (!trips) return null;

  return (
    <div className={gridClass}>
      {trips.map((trip) =>
        showPrivacy ? (
          <MyTripCard key={trip._id} trip={trip} />
        ) : (
          <ExploreTripCard key={trip._id} trip={trip} />
        )
      )}
    </div>
  );
};
