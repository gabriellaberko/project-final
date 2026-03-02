import Player from "lottie-react";
import emptyStateAnimation from "../../assets/empty-state-animation.json";


export const EmptyState = ({ headline, text }: {headline: string, text?: string}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">

      {/* Lottie placeholder */}
      <div className="mb-8">
        <Player
          animationData={emptyStateAnimation}
          loop
          autoplay
          style={{ width: 300, height: 200 }}
        />
      </div>

      {headline && <h2 className="text-2xl font-semibold mb-2">{headline ?? "Looks like it's empty here."}</h2>}

      {text && <p className="text-gray-500 max-w-sm">
        {text}
      </p>}

    </div>
  )
};