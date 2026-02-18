import { TripCard } from "./TripsCard";

interface TripsGridProps {
  trips: any[];
  columns?: 3 | 4;
  onCardClick?: (trip: any) => void;
}

export const TripsGrid = ({
  trips,
  columns = 4,
  onCardClick
}: TripsGridProps) => {

  const gridClass =
    columns === 4
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className={gridClass}>
      {trips.map((trip) => (
        <TripCard
          key={trip._id}
          trip={trip}
          onClick={() => onCardClick?.(trip)}
        />
      ))}
    </div>
  );
};
