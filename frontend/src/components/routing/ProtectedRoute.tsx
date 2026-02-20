import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/AuthStore";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
};