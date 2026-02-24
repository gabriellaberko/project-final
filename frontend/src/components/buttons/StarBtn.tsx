import { BtnProps } from "../../types/interfaces";

export const StarBtn = ({ onClick }: BtnProps) => { 

  return (
    <button onClick={onClick}>
      <img src="star.svg" alt="Star trip" />
    </button>
  )
};