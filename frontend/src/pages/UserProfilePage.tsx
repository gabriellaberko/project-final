import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { useAuthStore } from "../stores/AuthStore";

// MUI & Icons
import Avatar from "@mui/joy/Avatar";
import Switch from "@mui/joy/Switch";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Card from "@mui/joy/Card";
import FormLabel from "@mui/joy/FormLabel";
import Typography from "@mui/joy/Typography"

interface Trip {
  _id: string;
  destination: string;
  days: { dayNumber: number }[];
  tripName?: string; // optional
}

interface UserProfile {
  username: string;
  bio: string;
  avatarUrl?: string;
  isPublic: boolean;
  followers: number;
  following: number;
  trips: Trip[];
}

const Stat = ({ label, count }: {label: string, count: number}) => (
  <div className="text-content">
    <Typography level="body-xs">{count}</Typography>
    <Typography level="body-xs">{label}</Typography>
  </div>
)

const TripCard = ({ trip }: { trip: Trip }) => (
  <Card variant="outlined">
    <Typography level="h3">{trip.destination}</Typography>
    <Typography level="body-xs">{trip.days.length} days</Typography>
  </Card>
)


export const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { userId: currentUserId, accessToken } = useAuthStore();

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([])
  const [isPublic, setIsPublic] = useState(true)

  const isOwner = currentUserId=== userId

  useEffect(() => {
    if (!userId || userId === "undefined") return

    const fetchUserData = async () => {
      try {
        setLoading(true)
        const url = isOwner
          ? `http://localhost:8080/users/profile`
          : `http://localhost:8080/users/${userId}`

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

        const data = await response.json();

        setProfile(data);
        setUsername(data.username)
        setBio(data.bio || "");
        setTrips(data.trips || []);
        setIsPublic(data.isPublic ?? true)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [userId, isOwner, accessToken])


  const handleSave = async () => {
    try {
      const url = `http://localhost:8080/users/profile`
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ bio, username, isPublic})
      })
      if (response.ok) {
        const updatedData = await response.json()
        setIsEditing(false)
        setProfile(updatedData)
        setUsername(updatedData.username)
        setBio(updatedData.bio || "");
        setIsPublic(updatedData.isPublic ?? true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <>
      <div className='m-10'>
        <h1>UserProfilePage</h1>

        <div className='flex row items-center m-5'>
          <Avatar size='lg'/>

          <div className='m-5'>
            {isEditing ? (
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            ) : (
              <Typography level="h2">{profile?.username || "Username"}</Typography>
            )}
            <div className="flex gap-5">
              <div className="flex flex-row gap-5">
                <Stat label="Trips" count={trips.length} />
                <Stat label="Followers" count={0} />
                <Stat label="following" count={0} />
              </div>
            </div>
          </div>
        </div>

        {/* editable for owner */}
        <div className="flex flex-col gap-2 my-4">
          <FormLabel>Bio</FormLabel>
          {isEditing ? (
            <textarea
              className="border rounded-md p-2 w-full max-w-md"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your travels..."
              disabled={!isOwner}
            />
          ) : (
            <Typography className="mt-2">{bio || ""}</Typography>
          )}
        </div>

        <div>
          {isOwner ? (
            <div>
              {isEditing && (
                <div className="flex items-center gap-3 my-4">
                  <Typography level="body-sm">Public</Typography>
                  <Switch
                    checked={!isPublic} // Public is true by default
                    onChange={(e) => setIsPublic(!e.target.checked)}
                    // disabled={!isEditing} 
                  />
                  <Typography level="body-sm">Private</Typography>
                </div>
              )}

              <div className="flex gap-2">
                {isEditing ? (
                  <div className="flex gap-5">
                    <Button color="success" onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    type="button"
                    className="m-5"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
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
        </div>
        
        {/* Delete cards later */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <Card>Paris</Card>
            <Card>Barcelona</Card>
            <Card>Hawaii</Card>
            <Card>Tokyo</Card>
          </div>
          
          <div>
            {trips.map(trip => (
              <TripCard key={trip._id} trip={trip} />
            ))}  
          </div>
        </div>
    </>
  )
}
