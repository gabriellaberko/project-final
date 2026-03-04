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
        "bg-(--btn-primary)  text-white font-medium",
        "px-6 py-2 rounded-lg min-w-35",
        "transition-all duration-200 cursor-pointer",
        "hover:bg-(--btn-secondary) hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-(--btn-primary) focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};