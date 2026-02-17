import Avatar from '@mui/material/Avatar';

type Props = {
  username: string;
  onLogoutClick?: () => void;
}

export const NavAvatar = ({ username, onLogoutClick }: Props) => {
  return (
    <>
      <div className="flex items-center gap-4 p-4">
        <Avatar />
        <div>
          <h1>{username}</h1>
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
