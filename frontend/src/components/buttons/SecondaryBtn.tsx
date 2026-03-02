import { ButtonHTMLAttributes } from "react";

interface SecondaryBtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SecondaryBtn = ({
  children,
  className = "",
  ...props
}: SecondaryBtnProps) => {
  return (
    <button
      {...props}
      className={[
        "border border-gray-300 text-gray-700 font-medium",
        "px-6 py-2 rounded-lg",
        "bg-white",
        "transition-all duration-200",
        "hover:bg-gray-100",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};