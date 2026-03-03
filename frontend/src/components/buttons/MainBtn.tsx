import { ButtonHTMLAttributes } from "react";

interface MainBtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const MainBtn = ({ children, className = "", ...props }: MainBtnProps) => {
  return (
    <button
      {...props}
      className={[
        "btn",
        "flex items-center justify-center",
        "md:rounded-lg md:px-4 md:py-2",
        "rounded-full w-12 h-12 md:w-auto md:h-auto",
        "transition-all duration-200",
        "hover:opacity-90",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {/* Mobile: show plus */}
      <span className="block md:hidden text-3xl font-bold leading-none">+</span>

      {/* Desktop: show children */}
      <span className="hidden md:inline">{children}</span>
    </button>
  )
};