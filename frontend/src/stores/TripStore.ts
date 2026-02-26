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
  removeDay: (tripId: string, dayId: string) => Promise<void>;
  addDay: (tripId: string) => Promise<void>;
  removeActivity: (tripId: string, dayId: string, activityId: string) => Promise<void>;
  starTrip: (tripId: string) => Promise<void>;
  unstarTrip: (tripId: string) => Promise<void>;
  updatePrivacy: (tripId: string, isPublic: boolean) => Promise<void>;
  trips: TripInterFace[] | null;
  setTrips: (trips: TripInterFace[] | null) => void;
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

  updatePrivacy: async (tripId, isPublic) => {
    const url = `${API_URL}/trips/${tripId}/privacy`;
    const { accessToken } = useAuthStore.getState();
    const { setUpdateData } = get();

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


}));