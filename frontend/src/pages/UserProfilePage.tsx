import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/AuthStore";
import { UserProfileInterface } from "../types/interfaces";
import { useTripStore } from "../stores/TripStore";
import { TripsGrid } from "../components/common/TripsGrid";
import { LoadingState } from "../components/status/LoadingState";
import { ErrorState } from "../components/status/ErrorState";
import Avatar from "../assets/avatar.png";

// MUI & Icons
import Button from "@mui/joy/Button";
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
  const [bio, setBio] = useState("");
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
  const setAvatarUrl = useAuthStore(state => state.setAvatarUrl);


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
        setBio(data.bio || "");
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
        body: JSON.stringify({ bio })
      })
      if (response.ok) {
        const updatedData = await response.json()
        setIsEditing(false)
        setProfile(updatedData)
        setBio(updatedData.bio || "");
      }
    } catch (err) {
      console.error(err)
    }
  }


  const handleFollowing = async () => {
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


  const changeAvatar = async (file: File) => {
    const imageUploadUrl = `${API_URL}/uploadImage/profile`;
    const updateDbAvatarUrl = `${API_URL}/users/profile/avatar`;
    let uploadResponse = null;

    // Upload (post) to Cloudinary
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(imageUploadUrl, {
        method: "POST",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      uploadResponse = await response.json();
      console.log(uploadResponse)

    } catch(err) {
      console.log("Fetch error:", err);
    }

    // Update avatarUrl in the database profile
    try {
      const response = await fetch(updateDbAvatarUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ avatarUrl: uploadResponse.imageUrl })
      });

      const data = await response.json();
      setAvatarUrl(data.response.avatarUrl);
      setUpdateData();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

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
        {loading && <LoadingState />}

        {/* Error State */}
        {!loading && error && 
          <ErrorState text="Something went wrong while loading the profile. Please try again in a moment." />
        }

        <div className='flex row items-center'>
          <img 
            src={profile?.avatarUrl || Avatar}
            alt="Profile picture"
            className="w-28 h-28 rounded-full object-cover shrink-0" 
          />

          {/* Profile image upload */}
          <label htmlFor="avatarUpload" className="cursor-pointer text-sm text-blue-600 hover:underline">
            +
          </label>
          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                changeAvatar(e.target.files[0]);
              }
            }}
          />

          <div className='m-5'>
            <Typography level="h2">{profile?.userName || "Username"}</Typography>
            <div className="flex gap-5">
              <div className="flex flex-row gap-5 mt-2">
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
                onClick = {handleFollowing}
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
