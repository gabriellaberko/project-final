import { useNavigate } from "react-router-dom";


export const PublicNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="
      fixed top-0 left-0 right-0
      h-16 flex items-center justify-between
      px-6 bg-white shadow-sm z-50
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
            px-4 py-2 rounded-lg
            bg-gray-200 hover:bg-gray-300
            text-sm font-medium
            transition
          "
        >
          Sign up
        </button>
      </div>
    </nav>
  )
};