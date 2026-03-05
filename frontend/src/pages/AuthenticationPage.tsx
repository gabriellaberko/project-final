import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../stores/AuthStore";
import { AuthCard } from "../components/common/AuthCard";

export const AuthenticationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const activeTab = mode === "signup" ? 0 : 1;

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();

  const handleTabChange = (value: number) => {
    setSearchParams({ mode: value === 0 ? "signup" : "login" });
  };

  useEffect(() => {
    if (mode !== "signup" && mode !== "login") {
      setSearchParams({ mode: "login" });
    }
  }, [mode, setSearchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <AuthCard activeTab={activeTab} onTabChange={handleTabChange} />;
};