
import { AvatarProps } from '../../types/interfaces';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/AuthStore';
import Avatar from "../../assets/avatar.png";

export const NavAvatar = ({ username, onLogoutClick }: AvatarProps) => {
  const navigate = useNavigate();
  const userId = useAuthStore(state => state.userId);
  const avatarUrl = useAuthStore(state => state.avatarUrl);

  return (
    <>
      <div className="flex items-center gap-4 p-4">
        <img 
          src={avatarUrl || Avatar}
          alt="Profile picture"
          className="w-12 h-12 rounded-full object-cover shrink-0 cursor-pointer" 
          onClick={() => navigate(`/profile/${userId}`)}
        />
        <div className="flex flex-col">
          <h1 onClick={() => navigate(`/profile/${userId}`)} className="cursor-pointer m-0 text-base md:text-xl">{username}</h1>
          <button 
            type="button" 
            className="mt-1 text-sm text-white hover:text-gray-700 cursor-pointer transition"
            onClick={onLogoutClick}
          >
            Log out
          </button>
        </div>
      </div>
    </>
  )
}
