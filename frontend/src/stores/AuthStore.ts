import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  userName: string | null;
  login: (payload: { accessToken: string; userName: string }) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({

  accessToken: null,
  isAuthenticated: false, // Used for conditional rendering of certain components (that should only be seen by logged in users)
  userName: null, // To access to userName for display

  login: (payload: { accessToken: string, userName: string }) => {
    const { accessToken, userName } = payload;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userName", userName);
    set({
      accessToken,
      isAuthenticated: true,
      userName
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    set({
      accessToken: null,
      isAuthenticated: false,
      userName: null
    });
  },

  // To persist the login
  checkAuthStatus: () => {
    const accessToken = localStorage.getItem("accessToken");
    const userName = localStorage.getItem("userName");

    if(accessToken) {
      set({
        accessToken,
        isAuthenticated: true,
        userName
      });
    }
  }

}));