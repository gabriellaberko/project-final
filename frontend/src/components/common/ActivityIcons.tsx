import {
  Theater,
  Camera,
  Utensils,
  Trees,
  Mountain,
  Ticket,
  Wind,
  LucideProps,
} from "lucide-react"
import type { FC } from "react"

const ICON_MAP: Record<string, FC<LucideProps>> = {
  "Culture & Events": Theater,
  "Sightseeing": Camera,
  "Food & Drinks": Utensils,
  "Nature": Trees,
  "Adventure": Mountain,
  "Entertainment": Ticket,
  "Relaxation": Wind,
};

interface ActivityIconProps {
  category: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export const ActivityIcon = ({
  category,
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className = "",
}: ActivityIconProps) => {
  const Icon = ICON_MAP[category]

  return (
    <div>
      {Icon ? (
        <Icon
          size={size}
          color={color}
          strokeWidth={strokeWidth}
          className={className}
        />
      ) : null}
    </div>
  )
}
