export const EmptyState = ({ text }: {text: string}) => {
  <div className="flex flex-col items-center justify-center h-full text-center">

    {/* Lottie placeholder */}
    <div className="w-72 h-72 bg-gray-200 rounded-2xl mb-8" />

    <h2 className="text-2xl font-semibold mb-2">
      No trips yet
    </h2>

    <p className="text-gray-500 max-w-sm">
      {text ??
      "Looks like it's empty here."
      }
    </p>

  </div>
};