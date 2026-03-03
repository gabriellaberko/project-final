import { ClickBtnProps } from "../../types/interfaces";
import ImageUploadIcon from "../../assets/image-upload.png";


export const ImageUploadBtn = ({ onClick, size }: ClickBtnProps) => {

  return (
    <button
      type="button"
      onClick={onClick}>
      <img src={ImageUploadIcon} alt="Image Upload Icon" className={`w-${size ?? 7} h-${size ?? 7} cursor-pointer`} />
    </button>
  )
};