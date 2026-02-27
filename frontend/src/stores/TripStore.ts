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
  trips:TripInterFace[] | null;
  setTrips: (trips: TripInterFace[] | null) => void;
  removeDay: (tripId: string, dayId: string) => void;
  addDay: (tripId: string) => void;
  removeActivity: (tripId: string, dayId: string, activityId: string) => void;
  starTrip: (tripId: string) => void;
  unstarTrip: (tripId: string) => void;
  fetchMyTrips: () => void;
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
  trips: null,
  setTrips: (trips) => set({ trips }),

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
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      setUpdateData();

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
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      setUpdateData();

    } catch (err) { 
      console.log("Fetch error:", err);
    }
  },


}));