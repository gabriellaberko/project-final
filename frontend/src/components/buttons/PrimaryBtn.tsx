import { ButtonHTMLAttributes } from "react";

interface PrimaryBtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryBtn = ({
  children,
  className = "",
  ...props
}: PrimaryBtnProps) => {
  return (
    <button
      {...props}
      className={[
        "bg-[#1f6fb2] text-white font-medium",
        "px-6 py-2 rounded-lg",
        "transition-all duration-200",
        "hover:bg-[#175a91] hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};