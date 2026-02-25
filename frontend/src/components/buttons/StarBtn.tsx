import { BtnProps } from "../../types/interfaces";
import starIcon from "../../assets/star-grey.svg";
import filledStarIcon from "../../assets/star-filled.svg";


export const StarBtn = ({ onClick, isStarredByUser }: BtnProps) => { 

  return (
    <button onClick={onClick}>
      <img src={isStarredByUser ? filledStarIcon : starIcon} alt="Star trip" className="w-10 justify-self-end cursor-pointer"/>
    </button>
  )
};