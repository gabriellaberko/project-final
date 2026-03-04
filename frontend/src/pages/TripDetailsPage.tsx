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
import { PrimaryBtn } from "../components/buttons/PrimaryBtn";
import { SecondaryBtn } from "../components/buttons/SecondaryBtn";

// MUI & Icons
import FormLabel from "@mui/joy/FormLabel";
import Typography from "@mui/joy/Typography"


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
  const setUpdateData = useTripStore(state => state.setUpdateData);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const accessToken = useAuthStore(state => state.accessToken);
  const starTrip = useTripStore(state => state.starTrip);
  const unstarTrip = useTripStore(state => state.unstarTrip);
  const updatePrivacy = useTripStore(state => state.updatePrivacy);
  const { isTripCreator, isStarredByUser } = useTripPermissions(trip);
  const addDay = useTripStore(state => state.addDay);
  const moveActivity = useTripStore(state => state.moveActivity);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(trip?.description ?? "");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setDescription(trip?.description ?? "");
    setIsEditing(false);
  }, [trip]);

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

  const saveDescription = async () => {
    try {
      const url = `${API_URL}/trips/${tripId}/description`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ description })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json()
      setIsEditing(false)
      setUpdateData();

    } catch (err) {
      console.error(err)
    }
  };


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
          <div className="text-center flex flex-col items-center overflow-visible">

            {/* IMAGE */}
            <div className="relative w-full">
              <img
                src={trip.imageUrl}
                alt={trip.destination}
                className="w-full object-cover h-56 md:h-75"
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[5px]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <div className="flex items-center justify-center gap-2">
                  <h1>My {trip.destination} Trip</h1>
                  {isAuthenticated && !isTripCreator && (
                    isStarredByUser
                      ? <StarBtn size="10" onClick={() => unstarTrip(trip._id)} isStarredByUser={isStarredByUser} />
                      : <StarBtn size="10" onClick={() => starTrip(trip._id)} isStarredByUser={isStarredByUser} />
                  )}
                </div>

                {/* Trip creator */}
                {!isTripCreator &&
                  <Link to={`/profile/${trip.creator._id}`}>
                    <div className="flex items-center gap-2">
                      <img
                        src={trip.creator?.avatarUrl || Avatar}
                        alt="Profile picture"
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <span className="text-base text-white truncate">
                        {trip.creator?.userName}
                      </span>
                    </div>
                  </Link>
                }
              </div>

              {/* Public toggle */}
              {isTripCreator && (
                <div className="absolute top-5 right-5 flex items-center gap-3">
                  <span className="text-sm text-white">
                    {trip.isPublic ? "Public" : "Private"}
                  </span>
                  <button
                    onClick={() => updatePrivacy(trip._id, !trip.isPublic)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${trip.isPublic ? "bg-[#0066D2]" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${trip.isPublic ? "translate-x-5" : ""}`}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col items-center w-[70%] my-6 gap-2 mb-12">
              {trip.description && <h2>Description</h2>}
              {isEditing ? (
                <textarea
                  className="border rounded-md p-2 w-full max-w-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your travels..."
                  disabled={!isTripCreator}
                />
              ) : (
                <p className="mt-2 text-base">{trip.description || ""}</p>
              )}

              {/* Editable for owner */}
              {isTripCreator &&
                <div className="flex gap-2">
                  {isEditing
                    ? (
                      <div className="flex gap-5">
                        <SecondaryBtn onClick={() => setIsEditing(false)}>
                          Cancel
                        </SecondaryBtn>
                        <PrimaryBtn onClick={saveDescription}>
                          Save Changes
                        </PrimaryBtn>
                      </div>
                    )
                    : (
                      <SecondaryBtn onClick={() => setIsEditing(true)}>
                        {trip.description ? "Edit description" : "Add trip description"}
                      </SecondaryBtn>
                    )
                  }
                </div>
              }
            </div>
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

      {isAuthenticated && isTripCreator &&
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