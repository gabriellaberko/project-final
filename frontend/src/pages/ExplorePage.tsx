import { useState, useEffect } from "react"
import { useAuthStore } from "../stores/AuthStore";


export const ExplorePage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const accessToken = useAuthStore(state => state.accessToken);

  useEffect(() => {
    fetchPublicTrips();
  }, [accessToken]);

  const url = `http://localhost:8080/trips`;

  const fetchPublicTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers: HeadersInit = {};

      // Send token only if it exists
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch trips");
      }

      setTrips(data.response);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    </>
  )
}