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
  activities: ActivityInterface[]
};

export interface ProfileProps {
  _id?: string,
  name: string,
  imgSrc: string,
  githubLink: string,
  linkedinLink: string
};

export interface TripInterFace {
  tripName: string,
  _id: string,
  destination: string,
  days: DayInterface[],
  imageUrl: string,
  isCustomImgage: boolean,
  creator: {
    _id: string;
    userName: string;
    avatarUrl?: string;
  },
  isPublic: boolean,
  starredBy: string[];
};

export interface UserProfileInterface {
  _id: string;
  userName: string;
  bio: string;
  avatarUrl?: string;
  isPublic: boolean;
  followers: string[];
  following: string[];
};

export interface DayGridProps {
  columns?: 3 | 4;
};

export interface TripsGridProps extends DayGridProps {
  trips: TripInterFace[] | null;
  showPrivacy?: boolean;
};

export interface TripCardProps {
  trip: TripInterFace;
  onClick?: () => void;
  showPrivacy?: boolean;
  variant?: "vertical" | "horizontal";
};

export interface DayCardProps {
  day: DayInterface;
  onClick?: () => void;
};

export interface SearchBarProps {
  onSearch: (value?: string) => void;
};

export type AvatarProps = {
  username: string;
  onLogoutClick?: () => void;
};

export type ClickBtnProps = {
  children?: string;
  onClick?: () => void;
  className?: string;
  size?: string;
};

export interface StarBtnProps extends ClickBtnProps {
  isStarredByUser?: boolean;
};
