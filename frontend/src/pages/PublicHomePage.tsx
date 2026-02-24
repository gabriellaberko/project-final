import { useAuthStore } from "../stores/AuthStore";
import { Navigate } from "react-router-dom";

export const PublicHomePage = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      Public content
    </div>
  );
};