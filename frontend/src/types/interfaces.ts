import { DayGrid } from "../components/common/DayGrid";

export interface ActivityInterface {
  _id: string,
  name: string,
  description: string,
  category: string,
  time: string,
  googleMapLink: string
};

export interface DayInterface {
_id: string,
dayNumber: number,
activities: [ActivityInterface]
};

export interface TripInterFace { 
  tripName: string,
  _id: string,
  destination: string,
  days: DayInterface[],
  creator: string,
  isPublic: boolean,
  starredBy: string[];
}

export interface UserProfileInterface {
  userName: string;
  bio: string;
  avatarUrl?: string;
  isPublic: boolean;
  followers: number;
  following: number;
  trips: TripInterFace[];
}

export interface DayGridProps {
  columns?: 3 | 4;
}

export interface TripsGridProps extends DayGridProps {
  trips: TripInterFace[];
}

export interface TripCardProps {
  trip: {
    _id: string,
    destination: string;
    tripName?: string;
    days: any[];
  };
  onClick?: () => void;
}

export interface DayCardProps {
  day: DayInterface;
  onClick?: () => void;
}

export interface SearchBarProps {
  onSearch: (value?: string) => void;
}

export type AvatarProps = {
  username: string;
  onLogoutClick?: () => void;
}