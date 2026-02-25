export const MyFavoritesPage = () => { 
  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <div className="px-6 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          My Trips
        </h1>
      </div>

    </div>
  )
};
