import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  userName: string | null;
  userId: string | null;
  avatarUrl: string | null;
  login: (payload: { accessToken: string; userName: string; userId: string, avatarUrl: string }) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({

  accessToken: null,
  isAuthenticated: false, // Used for conditional rendering of certain components (that should only be seen by logged in users)
  userName: null, // To access to userName for display
  userId: null,
  avatarUrl: null,

  login: (payload: { accessToken: string, userName: string, userId: string, avatarUrl: string }) => {
    const { accessToken, userName, userId, avatarUrl } = payload;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId);
    localStorage.setItem("avatarUrl", avatarUrl);
    set({
      accessToken,
      isAuthenticated: true,
      userName,
      userId,
      avatarUrl
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("avatarUrl");
    set({
      accessToken: null,
      isAuthenticated: false,
      userName: null,
      userId: null,
      avatarUrl: null
    });
  },

  // To persist the login
  checkAuthStatus: () => {
    const accessToken = localStorage.getItem("accessToken");
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    const avatarUrl = localStorage.getItem("avatarUrl");

    if(accessToken) {
      set({
        accessToken,
        isAuthenticated: true,
        userName,
        userId,
        avatarUrl
      });
    }
  }
}));