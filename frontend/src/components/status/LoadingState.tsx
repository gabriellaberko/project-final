import Player from "lottie-react";
import loadingSpinner from "../../assets/loading-spinner.json";

export const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <Player
        animationData={loadingSpinner}
        loop
        autoplay
        style={{ width: 50, height: 50 }}
      />
    </div>
  )
};