import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { UserProfileInterface } from "../types/interfaces";
import { LoadingState } from "../components/status/LoadingState";
import { ErrorState } from "../components/status/ErrorState";
import { EmptyState } from "../components/status/EmptyState";


export const FollowListPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState<UserProfileInterface[]>([]);
  const isFollowersListRoute = location.pathname.includes("followers");
  const listType = isFollowersListRoute ? "followers" : "following";


  useEffect(() => {
    const fetchTrip = async () => {
      const url = `${API_URL}/users/${userId}/${listType}`;
      setError(false);
      setLoading(true);
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const fetchedUsers = await response.json();
        setUsers(fetchedUsers.response[listType]);
      } catch (err) {
        console.log("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [userId, listType]);


  return (
    <div className="px-6 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          {isFollowersListRoute ? "Followers" : "Following"}
        </h1>
      </div>

      {/* Content Area */}
      <div className="min-h-[65vh]">

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Error State */}
        {!loading && error && 
          <ErrorState text={isFollowersListRoute 
            ? "Couldn't load followers. Please try again." 
            : "Couldn't load following. Please try again."} />
        }

        {/* Empty State */}
        {!loading && !error && users && users.length === 0 &&
          <EmptyState headline={isFollowersListRoute 
            ? "No followers yet" 
            : "Not following anyone yet"} />
        }

        {/* TO DO: Replace with proper user cards with avatar */}
        {!loading && !error && users && users.length > 0 && (
          users.map((user) =>(
            <Link
            key={user._id}
            to={`/profile/${user._id}`}
            >
              <img src={user.avatarUrl} alt="" />
              <h2>{user.userName}</h2>
              {/* <MainBtn onClick={}></MainBtn> */}
            </Link>
          ))
          )}
      </div>
    </div>
  );
};