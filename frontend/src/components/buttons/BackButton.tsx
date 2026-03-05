import { ChevronLeft } from "lucide-react";

type BackButtonProps = {
  className?: string;
  label?: string;
};

export const BackButton = ({
  className = "",
  label = "Back",
}: BackButtonProps) => {
  const handleBack = () => {
    window.history.back();
  };


  return (
    <button
      onClick={handleBack}
      aria-label={label}
      className={[
        "group flex items-center gap-1.5",
        "text-gray-500 text-sm",
        "p-2 rounded-lg",
        "transition-colors duration-200",
        "hover:bg-gray-100 hover:text-gray-600",
        "focus:outline-none focus:ring-2 focus:ring-(--btn-primary) focus:ring-offset-2",
        className,
      ].join(" ")}
    >
      <ChevronLeft size={16} strokeWidth={3}
        className="transition-transform group-hover:-translate-x-0.5"
      />

      {/* text only on larger screens */}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};
