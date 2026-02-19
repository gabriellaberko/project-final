import { TripCard } from "./TripsCard";
import { Link } from "react-router-dom";

interface TripsGridProps {
  trips: any[];
  columns?: 3 | 4;
}

export const TripsGrid = ({ trips, columns = 4 }: TripsGridProps) => {

  const gridClass =
    columns === 4
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className={gridClass}>
      {trips.map((trip) => (
        <Link
          key={trip._id}
          to={`/trips/${trip._id}`}
          className="block"
        >
          <TripCard
            key={trip._id}
            trip={trip}
          />
        </Link>
      ))}
    </div>
  );
};
