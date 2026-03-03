import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTripStore } from "../stores/TripStore";
import { DayGrid } from "../components/common/DayGrid";
import { StarBtn } from "../components/buttons/StarBtn";
import { useAuthStore } from "../stores/AuthStore";
import { useTripPermissions } from "../components/hooks/useTripPermissions";
import { DragDropProvider } from "@dnd-kit/react"
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


  return (
    <>
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled || !trip) return;

          const { source, target } = event.operation;
          if (!source || !target) return;

          const sourceData = (source as any).data as { dayId?: string } | undefined;
          const targetData = (target as any).data as { dayId?: string } | undefined;
          const sourceDayId = sourceData?.dayId ?? String((source as any).sortable?.group ?? "");
          const targetDayId = targetData?.dayId ?? String((target as any).sortable?.group ?? target.id ?? "");

          if (!sourceDayId || !targetDayId) {
            return;
          }

          const sourceDayIndex = trip.days.findIndex((day) => day._id === sourceDayId);
          const targetDayIndex = trip.days.findIndex((day) => day._id === targetDayId);
          if (sourceDayIndex < 0 || targetDayIndex < 0) return;

          const sourceIndex = (source as any).sortable?.index ?? -1;
          let targetIndex = (target as any).sortable?.index ?? -1;
          if (sourceIndex < 0) return;

          const sourceDay = trip.days[sourceDayIndex];
          const targetDay = trip.days[targetDayIndex];
          if (!sourceDay || !targetDay) return;

          const sourceActivities = [...sourceDay.activities];
          const [moved] = sourceActivities.splice(sourceIndex, 1);
          if (!moved) return;

          const targetActivities =
            sourceDayId === targetDayId ? sourceActivities : [...targetDay.activities];

          if (targetIndex < 0 || targetIndex > targetActivities.length) {
            targetActivities.push(moved);
          } else {
            targetActivities.splice(targetIndex, 0, moved);
          }

          const updatedTrip = {
            ...trip,
            days: trip.days.map((d, index) => {
              if (sourceDayId === targetDayId && index === sourceDayIndex)
                return { ...d, activities: targetActivities }
              if (index === sourceDayIndex) {
                return { ...d, activities: sourceActivities };
              }
              if (index === targetDayIndex) {
                return { ...d, activities: targetActivities };
              }
              return d;
            }),
          };

          setTrip(updatedTrip);
          moveActivity(String(source.id), targetDayId, targetIndex)
        }}
      >
        {trip &&
          <div className="text-center flex flex-col items-center m-5">
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

            <div className="flex flex-col  items-center w-[70%] mb-12 gap-5">
              {isEditing ? (
                <textarea
                  className="border rounded-md p-2 w-full max-w-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your travels..."
                  disabled={!isTripCreator}
                />
              ) : (
                  <p className="mt-2 text-sm">{trip.description || ""}</p>
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
                      <PrimaryBtn color="success" onClick={saveDescription}>
                        Save Changes
                      </PrimaryBtn>
                    </div>
                    ) 
                  : (
                    <SecondaryBtn onClick={() => setIsEditing(true)}>
                      Edit description
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
      </DragDropProvider>

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