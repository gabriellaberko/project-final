import { BtnProps } from "../../types/interfaces";
import starIcon from "../../assets/star-grey.svg";
import filledStarIcon from "../../assets/star-filled.svg";


export const StarBtn = ({ onClick, isStarredByUser }: BtnProps) => {

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}>
      <img src={isStarredByUser ? filledStarIcon : starIcon} alt="Star trip" className="w-5 h-5 justify-self-end cursor-pointer" />
    </button>
  )
};