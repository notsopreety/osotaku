// Extended User types for profile features

export interface UserProfile {
  id: number;
  name: string;
  about?: string;
  avatar?: {
    large?: string;
    medium?: string;
  };
  bannerImage?: string;
  isFollowing?: boolean;
  isFollower?: boolean;
  donatorTier?: number;
  donatorBadge?: string;
  moderatorRoles?: string[];
  createdAt?: number;
  updatedAt?: number;
  statistics?: UserStatistics;
  favourites?: UserFavourites;
  siteUrl?: string;
  options?: UserOptions;
}

export interface UserStatistics {
  anime?: UserAnimeStatistics;
}

export interface UserAnimeStatistics {
  count?: number;
  meanScore?: number;
  standardDeviation?: number;
  minutesWatched?: number;
  episodesWatched?: number;
  chaptersRead?: number;
  volumesRead?: number;
  formats?: StatDistribution[];
  statuses?: StatDistribution[];
  scores?: ScoreDistribution[];
  lengths?: StatDistribution[];
  releaseYears?: StatDistribution[];
  startYears?: StatDistribution[];
  genres?: GenreDistribution[];
  tags?: TagDistribution[];
  countries?: StatDistribution[];
  voiceActors?: StaffDistribution[];
  staff?: StaffDistribution[];
  studios?: StudioDistribution[];
}

export interface StatDistribution {
  format?: string;
  status?: string;
  country?: string;
  length?: string;
  releaseYear?: number;
  startYear?: number;
  count: number;
  meanScore?: number;
  minutesWatched?: number;
  chaptersRead?: number;
  mediaIds?: number[];
}

export interface ScoreDistribution {
  score: number;
  count: number;
}

export interface GenreDistribution {
  genre: string;
  count: number;
  meanScore?: number;
  minutesWatched?: number;
}

export interface TagDistribution {
  tag: {
    id: number;
    name: string;
  };
  count: number;
  meanScore?: number;
  minutesWatched?: number;
}

export interface StaffDistribution {
  staff: {
    id: number;
    name: {
      full?: string;
    };
  };
  count: number;
  meanScore?: number;
  minutesWatched?: number;
}

export interface StudioDistribution {
  studio: {
    id: number;
    name: string;
  };
  count: number;
  meanScore?: number;
  minutesWatched?: number;
}

export interface UserFavourites {
  anime?: {
    nodes?: FavouriteMedia[];
    pageInfo?: PageInfo;
  };
  characters?: {
    nodes?: FavouriteCharacter[];
    pageInfo?: PageInfo;
  };
  staff?: {
    nodes?: FavouriteStaff[];
    pageInfo?: PageInfo;
  };
  studios?: {
    nodes?: FavouriteStudio[];
    pageInfo?: PageInfo;
  };
}

export interface FavouriteMedia {
  id: number;
  title?: {
    romaji?: string;
    english?: string;
  };
  coverImage?: {
    large?: string;
    medium?: string;
  };
  format?: string;
  averageScore?: number;
}

export interface FavouriteCharacter {
  id: number;
  name?: {
    full?: string;
  };
  image?: {
    large?: string;
    medium?: string;
  };
}

export interface FavouriteStaff {
  id: number;
  name?: {
    full?: string;
  };
  image?: {
    large?: string;
    medium?: string;
  };
}

export interface FavouriteStudio {
  id: number;
  name: string;
}

export interface PageInfo {
  total?: number;
  currentPage?: number;
  lastPage?: number;
  hasNextPage?: boolean;
}

export interface UserOptions {
  titleLanguage?: string;
  displayAdultContent?: boolean;
  airingNotifications?: boolean;
  profileColor?: string;
}

export interface FollowConnection {
  nodes?: UserProfile[];
  pageInfo?: PageInfo;
}

export interface UserActivity {
  id: number;
  type: string;
  status?: string;
  progress?: string;
  createdAt: number;
  media?: {
    id: number;
    title?: {
      romaji?: string;
      english?: string;
    };
    coverImage?: {
      medium?: string;
    };
  };
}
