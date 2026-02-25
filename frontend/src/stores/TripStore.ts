import { create } from "zustand";
import { useAuthStore } from "./AuthStore";
import { TripInterFace } from "../types/interfaces";


interface TripState {
  updateData: boolean;
  trip: TripInterFace | null;
  setTrip: (trip: TripInterFace | null) => void;
  setUpdateData: () => void;
  removeDay: (tripId: string, dayId: string) => Promise<void>;
  addDay: (tripId: string) => Promise<void>;
  removeActivity: (tripId: string, dayId: string, activityId: string) => Promise<void>;
  starTrip: (tripId: string) => Promise<void>;
  unstarTrip: (tripId: string) => Promise<void>;
  getIsTripCreator: () => boolean;
  getIsStarredByUser: () => boolean;
  updatePrivacy: (tripId: string, isPublic: boolean) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL;


export const useTripStore = create<TripState>((set, get) => ({
  updateData: false,
  setUpdateData: () => set((state) => ({ updateData: !state.updateData })),

  trip: null,
  setTrip: (trip) => set({ trip }),

  getIsTripCreator: () => {
    const { userId } = useAuthStore.getState();
    const { trip } = get();

    if (!trip || !userId) return false;
    return trip?.creator._id === userId;
  },

  getIsStarredByUser: () => {
    const { userId } = useAuthStore.getState();
    const { trip } = get();

    if (!trip || !userId) return false;
    return trip.starredBy.some((id) => id === userId);
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