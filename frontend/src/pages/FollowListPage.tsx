import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { UserProfileInterface } from "../types/interfaces";


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