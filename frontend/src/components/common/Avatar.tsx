
import { AvatarProps } from '../../types/interfaces';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/AuthStore';
import Avatar from "../../assets/avatar.png";

export const NavAvatar = ({ username, onLogoutClick }: AvatarProps) => {
  const navigate = useNavigate();
  const userId = useAuthStore(state => state.userId);
  const avatarUrl = useAuthStore(state => state.avatarUrl);
  console.log(typeof avatarUrl, JSON.stringify(avatarUrl))

  return (
    <>
      <div className="flex items-center gap-4 p-4">
        <img 
          src={avatarUrl || Avatar}
          alt="Profile picture"
          className="w-16 h-16 rounded-full object-cover shrink-0 cursor-pointer" 
          onClick={() => navigate(`/profile/${userId}`)}
        />
        <div className=''>
          <h1 onClick={() => navigate(`/profile/${userId}`)} className="cursor-pointer m-0 text-base md:text-xl">{username}</h1>
          <button 
            type="button" 
            className="mt-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition"
            onClick={onLogoutClick}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  )
}
