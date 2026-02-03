// AniList API Types

export interface Media {
  id: number;
  idMal?: number;
  title: MediaTitle;
  description?: string;
  format?: MediaFormat;
  status?: MediaStatus;
  episodes?: number;
  duration?: number;
  season?: MediaSeason;
  seasonYear?: number;
  startDate?: FuzzyDate;
  endDate?: FuzzyDate;
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  trending?: number;
  favourites?: number;
  genres?: string[];
  tags?: MediaTag[];
  rankings?: MediaRanking[];
  stats?: MediaStats;
  studios?: StudioConnection;
  source?: string;
  hashtag?: string;
  synonyms?: string[];
  countryOfOrigin?: string;
  coverImage?: MediaCoverImage;
  bannerImage?: string;
  trailer?: MediaTrailer;
  characters?: CharacterConnection;
  staff?: StaffConnection;
  relations?: MediaConnection;
  recommendations?: RecommendationConnection;
  externalLinks?: MediaExternalLink[];
  nextAiringEpisode?: AiringSchedule;
  isAdult?: boolean;
  siteUrl?: string;
}

export interface MediaTitle {
  romaji?: string;
  english?: string;
  native?: string;
  userPreferred?: string;
}

export type MediaFormat = 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC' | 'MANGA' | 'NOVEL' | 'ONE_SHOT';

export type MediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';

export type MediaSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

export interface FuzzyDate {
  year?: number;
  month?: number;
  day?: number;
}

// Input type for mutations
export interface FuzzyDateInput {
  year?: number;
  month?: number;
  day?: number;
}

export interface MediaTag {
  id: number;
  name: string;
  description?: string;
  category?: string;
  rank?: number;
  isGeneralSpoiler?: boolean;
  isMediaSpoiler?: boolean;
}

export interface MediaRanking {
  id: number;
  rank: number;
  type: 'RATED' | 'POPULAR';
  format?: MediaFormat;
  year?: number;
  season?: MediaSeason;
  allTime?: boolean;
  context: string;
}

export interface ScoreDistribution {
  score: number;
  amount: number;
}

export interface StatusDistribution {
  status: MediaListStatus;
  amount: number;
}

export interface MediaStats {
  scoreDistribution?: ScoreDistribution[];
  statusDistribution?: StatusDistribution[];
}

export interface MediaCoverImage {
  extraLarge?: string;
  large?: string;
  medium?: string;
  color?: string;
}

export interface MediaTrailer {
  id?: string;
  site?: string;
  thumbnail?: string;
}

export interface StudioConnection {
  edges?: StudioEdge[];
  nodes?: Studio[];
}

export interface StudioEdge {
  node?: Studio;
  isMain?: boolean;
}

export interface Studio {
  id: number;
  name: string;
  isAnimationStudio?: boolean;
  siteUrl?: string;
}

export interface CharacterConnection {
  edges?: CharacterEdge[];
  nodes?: Character[];
}

export interface CharacterEdge {
  node?: Character;
  role?: CharacterRole;
  voiceActors?: Staff[];
}

export type CharacterRole = 'MAIN' | 'SUPPORTING' | 'BACKGROUND';

export interface Character {
  id: number;
  name?: CharacterName;
  image?: CharacterImage;
  description?: string;
  gender?: string;
  age?: string;
  siteUrl?: string;
}

export interface CharacterName {
  first?: string;
  middle?: string;
  last?: string;
  full?: string;
  native?: string;
  alternative?: string[];
}

export interface CharacterImage {
  large?: string;
  medium?: string;
}

export interface StaffConnection {
  edges?: StaffEdge[];
  nodes?: Staff[];
}

export interface StaffEdge {
  node?: Staff;
  role?: string;
}

export interface Staff {
  id: number;
  name?: StaffName;
  language?: string;
  image?: StaffImage;
  description?: string;
  siteUrl?: string;
}

export interface StaffName {
  first?: string;
  middle?: string;
  last?: string;
  full?: string;
  native?: string;
}

export interface StaffImage {
  large?: string;
  medium?: string;
}

export interface MediaConnection {
  edges?: MediaEdge[];
  nodes?: Media[];
}

export interface MediaEdge {
  node?: Media;
  relationType?: MediaRelation;
}

export type MediaRelation = 'ADAPTATION' | 'PREQUEL' | 'SEQUEL' | 'PARENT' | 'SIDE_STORY' | 'CHARACTER' | 'SUMMARY' | 'ALTERNATIVE' | 'SPIN_OFF' | 'OTHER' | 'SOURCE' | 'COMPILATION' | 'CONTAINS';

export interface RecommendationConnection {
  nodes?: Recommendation[];
}

export interface Recommendation {
  id: number;
  rating?: number;
  mediaRecommendation?: Media;
}

export interface MediaExternalLink {
  id: number;
  url?: string;
  site: string;
  type?: ExternalLinkType;
  icon?: string;
  color?: string;
}

export type ExternalLinkType = 'INFO' | 'STREAMING' | 'SOCIAL';

export interface AiringSchedule {
  id: number;
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
  mediaId: number;
}

// Page/Query Types
export interface PageInfo {
  total?: number;
  perPage?: number;
  currentPage?: number;
  lastPage?: number;
  hasNextPage?: boolean;
}

export interface Page {
  pageInfo?: PageInfo;
  media?: Media[];
  airingSchedules?: AiringSchedule[];
}

// User Types (for AniList OAuth)
export interface User {
  id: number;
  name: string;
  about?: string;
  avatar?: UserAvatar;
  bannerImage?: string;
  statistics?: UserStatistics;
  siteUrl?: string;
}

export interface UserAvatar {
  large?: string;
  medium?: string;
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
}

// MediaList Types (for user's watchlist)
export interface MediaList {
  id: number;
  mediaId: number;
  status?: MediaListStatus;
  score?: number;
  progress?: number;
  repeat?: number;
  priority?: number;
  notes?: string;
  startedAt?: FuzzyDate;
  completedAt?: FuzzyDate;
  updatedAt?: number;
  media?: Media;
}

export type MediaListStatus = 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING';

export interface MediaListCollection {
  lists?: MediaListGroup[];
  user?: User;
}

export interface MediaListGroup {
  name?: string;
  status?: MediaListStatus;
  entries?: MediaList[];
}

// Episode Data Types (for local JSON files)
export interface EpisodeData {
  anilistId: number;
  totalEpisodes: number;
  episodes: Episode[];
}

export interface Episode {
  number: number;
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  isFiller?: boolean;
  servers: EpisodeServer[];
}

export interface EpisodeServer {
  name: string;
  type: 'hls' | 'embed';
  audio: 'sub' | 'dub';
  quality?: string;
  url: string;
}

// Genre type
export interface Genre {
  name: string;
  count?: number;
}
