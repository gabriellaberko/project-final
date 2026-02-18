import { create } from "zustand";

interface TripState {
  updateData: boolean;
  setUpdateData: () => void;
}

export const useTripStore = create<TripState>((set) => ({
  updateData: false, 

  setUpdateData: () => {
    set({
      updateData: true
    });
  },
}));