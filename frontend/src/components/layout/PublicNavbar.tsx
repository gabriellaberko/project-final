import { useNavigate } from "react-router-dom";
import { PrimaryBtn } from "../buttons/PrimaryBtn";


export const PublicNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="
    bg-white
      fixed top-0 left-0 right-0
      h-16 flex items-center justify-between
      px-6 shadow-sm z-50
    "
    >
      <div className="flex items-center gap-8 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="font-bold text-xl">Logo</div>
        <span className="text-lg font-medium">App</span>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/auth?mode=login")}
          className="
            text-sm font-medium
            text-gray-600 cursor-pointer
            hover:text-black transition
          "
        >
          Log in
        </button>

        <button
          onClick={() => navigate("/auth?mode=signup")}
          className="
            btn
            px-4 py-2 rounded-lg
            text-sm font-medium
            transition cursor-pointer
          "
        >
          Sign up
        </button>
      </div>
    </nav>
  )
};