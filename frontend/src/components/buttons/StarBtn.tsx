import { BtnProps } from "../../types/interfaces";

export const StarBtn = ({ onClick, isStarredByUser }: BtnProps) => { 

  return (
    <button onClick={onClick}>
      <img src={isStarredByUser ? "star-filled.svg" : "star.svg"} alt="Star trip" />
    </button>
  )
};