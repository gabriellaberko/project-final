import Avatar from '@mui/material/Avatar';
import { AvatarProps } from '../../types/interfaces';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/AuthStore';

export const NavAvatar = ({ username, onLogoutClick }: AvatarProps) => {
  const navigate = useNavigate();
  const userId = useAuthStore(state => state.userId);

  return (
    <>
      <div className="flex items-center gap-4 p-4">
        <Avatar />
        <div>
          <h1 onClick={() => navigate(`/profile/${userId}`)} className='cursor-pointer'>{username}</h1>
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
