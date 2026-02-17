import Avatar from '@mui/material/Avatar';

export const NavAvatar = () => {
  return (
    <>
      <div className="flex items-center gap-4 p-4">
        <Avatar />
        <div>
          <h1>username</h1>
          <button 
            type="button" 
            className="mt-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  )
}
