export const LoadingState = () => {
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="h-40 bg-gray-200 rounded-xl animate-pulse"
      />
    ))}
  </div>
};