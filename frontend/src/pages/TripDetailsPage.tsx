import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTripStore } from "../stores/TripStore";
import { DayGrid } from "../components/common/DayGrid";
import { ActivityPreview } from "../components/common/Activity";
import { StarBtn } from "../components/buttons/StarBtn";
import { useAuthStore } from "../stores/AuthStore";
import { useTripPermissions } from "../components/hooks/useTripPermissions";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  CollisionDetection,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { MainBtn } from "../components/buttons/MainBtn";
import { LoadingState } from "../components/status/LoadingState";
import { ErrorState } from "../components/status/ErrorState";
import Avatar from "../assets/avatar.png";


export const TripDetailsPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id: tripId } = useParams(); // Retrieve trip ID from the url
  const loading = useTripStore(state => state.loading);
  const setLoading = useTripStore(state => state.setLoading);
  const error = useTripStore(state => state.error);
  const setError = useTripStore(state => state.setError);
  const trip = useTripStore(state => state.trip);
  const setTrip = useTripStore(state => state.setTrip);
  const updateData = useTripStore(state => state.updateData);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const accessToken = useAuthStore(state => state.accessToken);
  const starTrip = useTripStore(state => state.starTrip);
  const unstarTrip = useTripStore(state => state.unstarTrip);
  const updatePrivacy = useTripStore(state => state.updatePrivacy);
  const { isTripCreator, isStarredByUser } = useTripPermissions(trip);
  const addDay = useTripStore(state => state.addDay);
  const moveActivity = useTripStore(state => state.moveActivity);
  const [activeId, setActiveId] = useState<string | null>(null);


  useEffect(() => {
    const fetchTrip = async () => {
      const url = `${API_URL}/trips/${tripId}`;
      setError(false);
      setLoading(true);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const fetchedTrip = await response.json();
        setTrip(fetchedTrip.response);
      } catch (err) {
        console.log("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [updateData, accessToken, tripId]);



  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      const activityCollision = pointerCollisions.find((c) => {
        const data = args.droppableContainers
          .find((container) => container.id === c.id)
          ?.data.current as { type?: string } | undefined;
        return data?.type === "activity";
      });
      if (activityCollision) return [activityCollision];

      const dayCollision = pointerCollisions.find((c) => {
        const data = args.droppableContainers
          .find((container) => container.id === c.id)
          ?.data.current as { type?: string } | undefined;
        return data?.type === "day";
      });
      return dayCollision ? [dayCollision] : pointerCollisions;
    }
    return closestCenter(args);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={(event) => {
          setActiveId(String(event.active.id));
        }}
        onDragEnd={(event) => {
          if (!trip || !isTripCreator) return;

          const { active, over } = event;
          setActiveId(null);
          if (!over) return;

          const activeId = String(active.id);
          const overId = String(over.id);

          const findDayByActivityId = (activityId: string) =>
            trip.days.find((d) => d.activities.some((a) => a._id === activityId));

          const sourceDay = findDayByActivityId(activeId);
          if (!sourceDay) return;

          const targetDay =
            (over.data.current as { dayId?: string } | undefined)?.dayId
              ? trip.days.find((d) => d._id === (over.data.current as any).dayId)
              : trip.days.find((d) => d._id === overId) || findDayByActivityId(overId);

          if (!targetDay) return;

          const sourceDayId = sourceDay._id;
          const targetDayId = targetDay._id;

          const sourceIndex = sourceDay.activities.findIndex((a) => a._id === activeId);
          if (sourceIndex < 0) return;

          const targetIndexFromOver = targetDay.activities.findIndex((a) => a._id === overId);

          const sourceActivities = [...sourceDay.activities];
          const [moved] = sourceActivities.splice(sourceIndex, 1);
          if (!moved) return;

          if (sourceDayId === targetDayId) {
            const targetIndex =
              targetIndexFromOver < 0 ? sourceDay.activities.length - 1 : targetIndexFromOver;
            if (sourceIndex === targetIndex) return;

            const reordered = arrayMove(sourceDay.activities, sourceIndex, targetIndex);

            const updatedTrip = {
              ...trip,
              days: trip.days.map((d) =>
                d._id === sourceDayId ? { ...d, activities: reordered } : d
              ),
            };

            setTrip(updatedTrip);
            moveActivity(activeId, targetDayId, targetIndex);
            return;
          }

          const targetActivities = [...targetDay.activities];

          const droppingOnContainer = targetIndexFromOver < 0;
          let insertIndex = droppingOnContainer ? targetActivities.length : targetIndexFromOver;
          if (insertIndex < 0) insertIndex = 0;

          targetActivities.splice(insertIndex, 0, moved);

          const updatedTrip = {
            ...trip,
            days: trip.days.map((d) => {
              if (sourceDayId === targetDayId && d._id === sourceDayId)
                return { ...d, activities: targetActivities }
              if (d._id === sourceDayId) {
                return { ...d, activities: sourceActivities };
              }
              if (d._id === targetDayId) {
                return { ...d, activities: targetActivities };
              }
              return d;
            }),
          };

          setTrip(updatedTrip);
          moveActivity(activeId, targetDayId, insertIndex)
        }}
        onDragCancel={() => setActiveId(null)}
      >
        {trip &&
          <div className="text-center flex flex-col items-center m-5 overflow-visible">
            <div className="flex w-full justify-center items-center gap-2 mb-5">

              <h1>My {trip.destination} Trip</h1>

              {isTripCreator && (
                <div className="absolute right-5 flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {trip.isPublic ? "Public" : "Private"}
                  </span>

                  <button
                    onClick={() => updatePrivacy(trip._id, !trip.isPublic)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${trip.isPublic ? "bg-gray-700" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${trip.isPublic ? "translate-x-5" : ""
                        }`}
                    />
                  </button>
                </div>
              )}

              {isAuthenticated && !isTripCreator &&
                (
                  isStarredByUser
                    ? <StarBtn size="7" className="self-end" onClick={() => unstarTrip(trip._id)} isStarredByUser={isStarredByUser} />
                    : <StarBtn size="7" className="self-end" onClick={() => starTrip(trip._id)} isStarredByUser={isStarredByUser} />
                )
              }
            </div>
            {!isTripCreator &&
              <Link to={`/profile/${trip.creator._id}`}>
                <div className="flex items-center gap-2 mb-10">
                  <p>Created by</p>
                  <img
                    src={trip.creator?.avatarUrl || Avatar}
                    alt="Profile picture"
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <span className="text-base text-gray-500 truncate">
                    {trip.creator?.userName}
                  </span>
                </div>
              </Link>
            }

            {/* Loading State */}
            {loading && <LoadingState />}

            {/* Error State */}
            {!loading && error &&
              <ErrorState text="Couldn't load your trip. Please try again in a moment." />
            }

            {/* Grid State */}
            {!loading && !error && (
              <DayGrid
                columns={3}
              />
            )}
          </div>
        }
        <DragOverlay>
          {activeId && trip ? (() => {
            const activity = trip.days
              .map((d) => d.activities)
              .reduce((acc, val) => acc.concat(val), [])
              .find((a) => a._id === activeId);
            if (!activity) return null;
            return <ActivityPreview activity={activity} />;
          })() : null}
        </DragOverlay>
      </DndContext>

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

// TODO: add img in page
