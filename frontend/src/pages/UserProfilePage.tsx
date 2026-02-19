import { useState } from "react";
import { useAuthStore } from "../stores/AuthStore";

interface Trip {
  _id: string;
  destination: string;
  days: { dayNumber: number }[];
  tripName?: string; // optional
}

// MUI import
import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import FormLabel from "@mui/joy/FormLabel";

export const UserProfilePage = () => {
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  
  const accessToken = useAuthStore((state: any) => state.accessToken) || undefined
  
  const isOwner = true; // Define isOwner state

  const editProfile = async () => {
    const url = `http://localhost:8080/users/profile` // Replace with deployed API link 
    try {
      const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify({
          bio: bio,
          isPublic: isPublic
        }),
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (err) {
        console.error("Sending error:", err);
        setErrorMessage("Could not edit profile");
        setError(true);
    }
  }

  return (
    <>
      <div className='m-10'>
        <h1>UserProfilePage</h1>
        <div className='flex row items-center m-5'>
          <Avatar size='lg'/>
          <div className='m-5'>
            <h2>username</h2>
            <div className="flex gap-5">
              <div>
                <span>0</span>
                <h3>Trips</h3>
              </div>
              <div>
                <span>0</span>
                <h3>Followers</h3>
              </div>
              <div>
                <span>0</span>
                <h3>Following</h3>
              </div>
            </div>
          </div>
        </div>

        {/* editable for owner */}
        <p>bio</p>
        <div className="flex flex-col gap-2 my-4">
          <FormLabel>Bio</FormLabel>
          {/* test area should be shown only after the owner wants to edit profile */}
          <textarea
            className="border rounded-md p-2 w-full max-w-md"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your travels..."
            disabled={!isOwner}
          />
        </div>

        {isOwner ? (
          <div className="flex gap-4 flex-col">
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm font-medium">
                Public
              </span>

              <FormLabel className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                />

                <div className="
                  w-12 h-7 bg-gray-300 rounded-full 
                  peer-checked:bg-blue-500 
                  transition-colors duration-300
                  "
                >
                </div>

                <div className="
                  absolute top-1 left-1 w-5 h-5 bg-white rounded-full 
                  transition-transform duration-300 
                  peer-checked:translate-x-5
                  "
                >
                </div>
              </FormLabel>
              <span className="text-sm font-medium">
                Private
              </span>
            </div>
            <Button 
              type="button"
              className="m-5"
            >
              Edit profile
            </Button>
          </div>

        ) : (
            <div className="flex flex-col mt-3 mb-3">
              <Button 
                type="button"
                className="m-5"
              >
                Follow
              </Button>
            </div>
        )}

            <div>
              <h3>Posts</h3>

              {/* TO DO: fetch trips from my trips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>Paris</Card>
                <Card>Barcelona</Card>
                <Card>Hawaii</Card>
                <Card>Tokyo</Card>
              </div>
              {!loading && !error && trips.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip) => (
                    <div
                      key={trip._id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition 
                        h-44 flex flex-col items-center justify-center text-center p-4"
                    >
                      {/* Optional Trip Name */}
                      {trip.tripName?.trim() && (
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                          {trip.tripName}
                        </p>
                      )}

                      {/* Destination */}
                      <h3 className="text-lg font-semibold">
                        {trip.destination}
                      </h3>

                      {/* Number of Days */}
                      <p className="text-sm text-gray-500 mt-1">
                        {trip.days.length} {trip.days.length === 1 ? "day" : "days"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
      </div>
    </>
  )
}
