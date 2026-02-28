import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/AuthStore";
import { UserProfileInterface } from "../types/interfaces";
import { useTripStore } from "../stores/TripStore";
import { TripsGrid } from "../components/common/TripsGrid";

// MUI & Icons
import Avatar from "@mui/joy/Avatar";
import Switch from "@mui/joy/Switch";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import FormLabel from "@mui/joy/FormLabel";
import Typography from "@mui/joy/Typography"


const Stat = ({ label, count, onClick }: {label: string, count: number, onClick?: () => void}) => (
  <button className="text-content cursor-pointer" onClick={onClick}>
    <Typography level="body-xs">{count}</Typography>
    <Typography level="body-xs">{label}</Typography>
  </button>
);


export const UserProfilePage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { userId: authUserId, accessToken } = useAuthStore();

  const [profile, setProfile] = useState<UserProfileInterface | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  // const [isPublic, setIsPublic] = useState(true);
  const error = useTripStore(state => state.error);
  const setError = useTripStore(state => state.setError);
  const loading = useTripStore(state => state.error);
  const setLoading = useTripStore(state => state.setError);
  const updateData = useTripStore(state => state.updateData);
  const setUpdateData = useTripStore(state => state.setUpdateData);
  const fetchMyTrips = useTripStore(state => state.fetchMyTrips);
  const fetchPublicTripsFromUser = useTripStore(state => state.fetchPublicTripsFromUser);
  const trips = useTripStore(state => state.trips);
  const isOwner = authUserId === userId;
  const isAlreadyFollowingUser = profile?.followers.some(f => f === authUserId); 


  useEffect(() => {
    if (!userId || userId === "undefined") return

    const fetchUserData = async () => {
      setLoading(true);
      setError(false);
      try {
        const url = isOwner
          ? `${API_URL}/users/profile`
          : `${API_URL}/users/${userId}`;

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
        // setIsPublic(data.isPublic ?? true)
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData()
  }, [userId, isOwner, accessToken, updateData]);

  useEffect(() => {
    if (isOwner) {
      fetchMyTrips();
    } 
    if (!isOwner && userId) {
      fetchPublicTripsFromUser(userId);
    };
  }, [])


  const handleSave = async () => {
    try {
      const url = `${API_URL}/users/profile`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ bio, userName: username})
      })
      if (response.ok) {
        const updatedData = await response.json()
        setIsEditing(false)
        setProfile(updatedData)
        setUsername(updatedData.userName)
        setBio(updatedData.bio || "");
        // setIsPublic(updatedData.isPublic ?? true)
      }
    } catch (err) {
      console.error(err)
    }
  }


  const HandleFollowing = async () => {
    try {
      const url = isAlreadyFollowingUser
        ? `${API_URL}/users/${userId}/unfollow`
        : `${API_URL}/users/${userId}/follow`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      setUpdateData();

    } catch (err) { 
      console.log("Fetch error:", err);
    }
  };


  if (loading) return <div>Loading...</div>

  return (
    <>
      <div className='m-10'>

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            {isOwner ? "My Profile" : "User Profile"}
          </h1>
        </div>


        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
              <h2 className="font-semibold mb-1">
                Something went wrong
              </h2>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className='flex row items-center m-5'>
          <Avatar size='lg' />

          <div className='m-5'>
            {isEditing ? (
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            ) : (
              <Typography level="h2">{profile?.userName || "Username"}</Typography>
            )}
            <div className="flex gap-5">
              <div className="flex flex-row gap-5">
                <Stat label="Trips" count={trips ? trips.length : 0} />
                <Stat 
                  label="Followers" 
                  count={profile? profile.followers.length: 0}
                  onClick={() => navigate(`/profile/${userId}/followers`)}/>
                <Stat 
                  label="Following" 
                  count={profile? profile.following.length: 0}
                  onClick={() => navigate(`/profile/${userId}/following`)} />
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

        <div className="mb-10">
          {isOwner ? (
            <div>
              {/* {isEditing && (
                <div className="flex items-center gap-3 my-4">
                  <Typography level="body-sm">Public</Typography>
                  <Switch
                    checked={!isPublic}
                    onChange={(e) => setIsPublic(!e.target.checked)}
                  />
                  <Typography level="body-sm">Private</Typography>
                </div>
              )} */}

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
                onClick = {HandleFollowing}
              >
                {isAlreadyFollowingUser
                  ? "Unfollow" 
                  : "Follow"}
              </Button> 
            </div>
          )}
        </div>

        {/* Grid State */}
        {!loading && !error && trips && trips.length > 0 && (
          <TripsGrid
            trips={trips}
            columns={3}
          />
        )}
          
      </div>
    </>
  )
};
