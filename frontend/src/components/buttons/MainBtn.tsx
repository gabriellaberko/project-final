type Props = {
  children: string;
  onClick: () => void;
};


export const MainBtn = ({ children, onClick }: Props) => {
  return (
    <button
      className="
        bg-[#837E7E] 
        text-white
        flex items-center justify-center
        md:rounded-lg md:px-4 md:py-2
        rounded-full w-12 h-12
        md:w-auto md:h-auto
      "
      onClick={onClick}>
      {/* Mobile: show plus */}
      <span className="block md:hidden text-3xl font-bold leading-none">+</span>

      {/* Desktop: show children */}
      <span className="hidden md:inline">{children}</span>
    </button>
  )
};