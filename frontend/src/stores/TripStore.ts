import { create } from "zustand";
import { useAuthStore } from "./AuthStore";

interface ActivityInterface {
  _id: string,
  name: string,
  description: string,
  category: string,
  time: string,
  googleMapLink: string
};

interface DayInterface {
_id: string,
dayNumber: number,
activities: [ActivityInterface]
};

interface TripInterFace { 
  tripName: string,
  _id: string,
  destination: string,
  days: DayInterface[],
  creator: string,
  isPublic: boolean,
  starredBy: string[];
}

interface TripState {
  updateData: boolean;
  trip: TripInterFace | null;
  setUpdateData: () => void;
  resetUpdateData: () => void;
  removeDay: (tripId: string, dayId: string) => void;
  addDay: (tripId: string) => void;
  removeActivity: (tripId: string, dayId: string, activityId: string) => void;
  setTrip: (trip: TripInterFace | null) => void;
}

const API_URL = import.meta.env.VITE_API_URL;


export const useTripStore = create<TripState>((set, get) => ({
  updateData: false,
  setUpdateData: () => set({ updateData: true }),
  resetUpdateData: () => set({ updateData: false }),

  trip: null,
  setTrip: (trip) => set({ trip }),

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

}));