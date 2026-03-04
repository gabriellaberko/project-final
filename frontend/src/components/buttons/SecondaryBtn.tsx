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
        "bg-white min-w-35",
        "transition-all duration-200",
        "hover:bg-gray-100 cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-(--btn-primary) focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};