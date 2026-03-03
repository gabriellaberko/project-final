import { create } from "zustand";
import { useAuthStore } from "./AuthStore";
import { TripInterFace } from "../types/interfaces";

interface TripState {
  updateData: boolean;
  setUpdateData: () => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  error: boolean;
  setError: (value: boolean) => void;
  trip: TripInterFace | null;
  setTrip: (trip: TripInterFace | null) => void;
  trips: TripInterFace[] | null;
  setTrips: (trips: TripInterFace[] | null) => void;
  removeDay: (tripId: string, dayId: string) => void;
  addDay: (tripId: string) => void;
  editActivity: (tripId: string, dayId: string, activityId: string, data: { name?: string; description?: string; time?: string; category?: string }) => void;
  removeActivity: (tripId: string, dayId: string, activityId: string) => void;
  moveActivity: (activityId: string, newDayId: string, newIndex: number) => Promise<void>;
  starTrip: (tripId: string) => Promise<void>;
  unstarTrip: (tripId: string) => Promise<void>;
  removeTrip: (tripId: string) => void;
  fetchMyTrips: () => void;
  fetchPublicTripsFromUser: (userId: string) => void;
  fetchPublicTrips: (query?: string, target?: "default" | "trending") => void;
  updatePrivacy: (tripId: string, isPublic: boolean) => Promise<void>;
  fetchCityImages: (city: string) => Promise<string[] | null>;
  createTrip: (data: { tripName: string, destination: string, numberOfDays: number, isPublic: boolean, imageUrl: string, isCustomImage: boolean }) => Promise<string | null>;
  fetchFeedTrips: () => Promise<void>;
  setFeedTrips: (trips: TripInterFace[] | null) => void;
  setTrendingTrips: (trips: TripInterFace[] | null) => void;
  feedTrips: TripInterFace[] | null;
  trendingTrips: TripInterFace[] | null;
}

const API_URL = import.meta.env.VITE_API_URL;


export const useTripStore = create<TripState>((set, get) => ({
  updateData: false,
  setUpdateData: () => set((state) => ({ updateData: !state.updateData })),

  loading: false,
  setLoading: (value: boolean) => set({ loading: value }),

  error: false,
  setError: (value: boolean) => set({ error: value }),

  // For setting one trip
  trip: null,
  setTrip: (trip) => set({ trip }),

  // For setting several trips
  trips: [],
  setTrips: (trips) => set({ trips }),

  feedTrips: [],
  trendingTrips: [],

  setFeedTrips: (trips) => set({ feedTrips: trips }),
  setTrendingTrips: (trips) => set({ trendingTrips: trips }),

  fetchMyTrips: async () => {
    const url = `${API_URL}/trips/my`;
    const { accessToken } = useAuthStore.getState();
    const { setLoading } = get();
    const { setError } = get();
    const { setTrips } = get();

    setError(false);
    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`);
      }

      setTrips(data.response);

    } catch (err) {
      console.log("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  },

  fetchPublicTripsFromUser: async (userId) => {
    const url = `${API_URL}/trips/user/${userId}`;
    const { accessToken } = useAuthStore.getState();
    const { setLoading } = get();
    const { setError } = get();
    const { setTrips } = get();

    setError(false);
    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`);
      }

      setTrips(data.response);

    } catch (err) {
      console.log("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  },

  fetchPublicTrips: async (query = "", target: "default" | "trending" = "default") => {
    const url = `${API_URL}/trips${query}`;
    const { accessToken } = useAuthStore.getState();
    const { setLoading, setError, setTrips, setTrendingTrips } = get();

    setError(false);
    setLoading(true);

    try {
      const response = await fetch(url, {
        headers: {
          ...(accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {}
          )
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch trips");
      }
      if (target === "trending") {
        setTrendingTrips(data.response);
      } else {
        setTrips(data.response);
      }

    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  },

  fetchFeedTrips: async () => {
    const url = `${API_URL}/trips/feed`;
    const { accessToken } = useAuthStore.getState();
    const { setFeedTrips, setLoading, setError } = get();

    setLoading(true);
    setError(false);

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setFeedTrips(data.response);

    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  },

  removeDay: async (tripId, dayId) => {
    const url = `${API_URL}/trips/${tripId}/days/${dayId}`;
    const { accessToken } = useAuthStore.getState();
    const { setUpdateData } = get();

    try {
      const response = await fetch(url, {
        method: "DELETE",
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
  },

  addDay: async (tripId) => {
    const url = `${API_URL}/trips/${tripId}/days`;
    const { accessToken } = useAuthStore.getState();
    const { setUpdateData } = get();

    try {
      const response = await fetch(url, {
        method: "POST",
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
  },

  editActivity: async (tripId, dayId, activityId, data) => {
    const url = `${API_URL}/trips/${tripId}/days/${dayId}/activities/${activityId}`;
    const { accessToken } = useAuthStore.getState();
    const { setUpdateData } = get();

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      setUpdateData();

    } catch (err) {
      console.log("Fetch error:", err);
    }
  },

  moveActivity: async (activityId, newDayId, newIndex) => {
    const { trip, setUpdateData } = get()
    const { accessToken } = useAuthStore.getState()

    if (!trip) return

    const url = `${API_URL}/trips/${trip._id}/days/${newDayId}/activities/${activityId}/move`

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ newIndex })
      })

      if (!response.ok) {
        throw new Error(`Failed to move activity: ${response.status}`)
      }

    } catch (err) {
      console.error(err)
    }
  },

  removeActivity: async (tripId, dayId, activityId) => {
    const url = `${API_URL}/trips/${tripId}/days/${dayId}/activities/${activityId}`;
    const { accessToken } = useAuthStore.getState();
    const { setUpdateData } = get();

    try {
      const response = await fetch(url, {
        method: "DELETE",
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
  },

  starTrip: async (tripId) => {
    const url = `${API_URL}/trips/${tripId}/star`;
    const { accessToken } = useAuthStore.getState();
    const { setUpdateData } = get();

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
      });

      const data = await response.json();
      setUpdateData();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      set((state) => ({
        trips: (state.trips || []).map((trip) =>
          trip._id === tripId ? data.response : trip
        ),
        feedTrips: (state.feedTrips || []).map((trip) =>
          trip._id === tripId ? data.response : trip
        ),

        trendingTrips: (state.trendingTrips || []).map((trip) =>
          trip._id === tripId ? data.response : trip
        ),
        trip: state.trip?._id === tripId
          ? data.response
          : state.trip
      }));

    } catch (err) {
      console.log("Fetch error:", err);
    }
  },

  unstarTrip: async (tripId) => {
    const url = `${API_URL}/trips/${tripId}/unstar`;
    const { accessToken } = useAuthStore.getState();
    const { setUpdateData } = get();

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
      });

      const data = await response.json();
      setUpdateData();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      set((state) => ({
        trips: (state.trips || []).map((trip) =>
          trip._id === tripId ? data.response : trip
        ),
        feedTrips: (state.feedTrips || []).map((trip) =>
          trip._id === tripId ? data.response : trip
        ),

        trendingTrips: (state.trendingTrips || []).map((trip) =>
          trip._id === tripId ? data.response : trip
        ),
        trip: state.trip?._id === tripId
          ? data.response
          : state.trip
      }));

    } catch (err) {
      console.log("Fetch error:", err);
    }
  },

  removeTrip: (tripId) => {
    set((state) => ({
      trips: state.trips ? state.trips.filter(trip => trip._id !== tripId) : null,
      trip: state.trip?._id === tripId ? null : state.trip
    }));
  },

  updatePrivacy: async (tripId, isPublic) => {
    const url = `${API_URL}/trips/${tripId}/privacy`;
    const { accessToken } = useAuthStore.getState();

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ isPublic })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      set((state) => ({ trip: state.trip ? { ...state.trip, isPublic } : null }));

    } catch (err) {
      console.log("Fetch error:", err);
    }
  },

  fetchCityImages: async (city) => {
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) return null;

    try {
      const response = await fetch(
        `${API_URL}/city-images?city=${city}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch images");
      }

      return data.images as string[];

    } catch (err) {
      console.error("Error fetching city images:", err);
      return null;
    }
  },

  createTrip: async ({
    tripName,
    destination,
    numberOfDays,
    isPublic,
    imageUrl,
    isCustomImage
  }) => {
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) return null;

    try {
      const response = await fetch(`${API_URL}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          tripName,
          destination,
          numberOfDays,
          isPublic,
          imageUrl,
          isCustomImage
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create trip");
      }

      return data.response._id as string;

    } catch (err) {
      console.error("Error creating trip:", err);
      return null;
    }
  }
}));
