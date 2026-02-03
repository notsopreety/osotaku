import { useQuery } from '@tanstack/react-query';
import { 
  fetchAniList, 
  TRENDING_ANIME_QUERY, 
  POPULAR_ANIME_QUERY, 
  POPULAR_THIS_SEASON_QUERY,
  TOP_RATED_ANIME_QUERY,
  RECENTLY_UPDATED_QUERY,
  ANIME_DETAILS_QUERY,
  SEARCH_ANIME_QUERY,
  GENRES_QUERY,
  HOMEPAGE_QUERY,
  getCurrentSeason
} from '@/lib/anilist';
import type { Media, Page, AiringSchedule } from '@/types/anime';

interface PageResponse {
  Page: Page;
}

interface MediaResponse {
  Media: Media;
}

interface GenresResponse {
  GenreCollection: string[];
}

interface AiringScheduleWithMedia extends AiringSchedule {
  media: Media;
}

// Trending Anime
export function useTrendingAnime(page = 1, perPage = 20) {
  return useQuery({
    queryKey: ['trending-anime', page, perPage],
    queryFn: async () => {
      const data = await fetchAniList<PageResponse>(TRENDING_ANIME_QUERY, { page, perPage });
      return {
        media: data.Page.media || [],
        pageInfo: data.Page.pageInfo,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Popular Anime (All Time)
export function usePopularAnime(page = 1, perPage = 20) {
  return useQuery({
    queryKey: ['popular-anime', page, perPage],
    queryFn: async () => {
      const data = await fetchAniList<PageResponse>(POPULAR_ANIME_QUERY, { page, perPage });
      return {
        media: data.Page.media || [],
        pageInfo: data.Page.pageInfo,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Popular This Season
export function usePopularThisSeason(page = 1, perPage = 20) {
  const { season, year } = getCurrentSeason();
  
  return useQuery({
    queryKey: ['popular-this-season', page, perPage, season, year],
    queryFn: async () => {
      const data = await fetchAniList<PageResponse>(POPULAR_THIS_SEASON_QUERY, { 
        page, 
        perPage,
        season,
        seasonYear: year,
      });
      return {
        media: data.Page.media || [],
        pageInfo: data.Page.pageInfo,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Top Rated Anime
export function useTopRatedAnime(page = 1, perPage = 20) {
  return useQuery({
    queryKey: ['top-rated-anime', page, perPage],
    queryFn: async () => {
      const data = await fetchAniList<PageResponse>(TOP_RATED_ANIME_QUERY, { page, perPage });
      return {
        media: data.Page.media || [],
        pageInfo: data.Page.pageInfo,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Recently Updated (Airing)
export function useRecentlyUpdated(page = 1, perPage = 20) {
  return useQuery({
    queryKey: ['recently-updated', page, perPage],
    queryFn: async () => {
      const data = await fetchAniList<{ Page: { airingSchedules: AiringScheduleWithMedia[] } }>(
        RECENTLY_UPDATED_QUERY, 
        { page, perPage }
      );
      // Extract unique media from airing schedules
      const seenIds = new Set<number>();
      const media: Media[] = [];
      
      for (const schedule of data.Page.airingSchedules || []) {
        if (schedule.media && !seenIds.has(schedule.media.id)) {
          seenIds.add(schedule.media.id);
          media.push(schedule.media);
        }
      }
      
      return { media };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Anime Details
export function useAnimeDetails(id: number | undefined) {
  return useQuery({
    queryKey: ['anime-details', id],
    queryFn: async () => {
      if (!id) throw new Error('No anime ID provided');
      const data = await fetchAniList<MediaResponse>(ANIME_DETAILS_QUERY, { id });
      return data.Media;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Search Anime
interface SearchParams {
  search?: string;
  genres?: string[];
  tags?: string[];
  year?: number;
  season?: string;
  format?: string;
  status?: string;
  sort?: string[];
  page?: number;
  perPage?: number;
}

export function useSearchAnime(params: SearchParams) {
  return useQuery({
    queryKey: ['search-anime', params],
    queryFn: async () => {
      const data = await fetchAniList<PageResponse>(SEARCH_ANIME_QUERY, {
        ...params,
        page: params.page || 1,
        perPage: params.perPage || 20,
        sort: params.sort || ['POPULARITY_DESC'],
      });
      return {
        media: data.Page.media || [],
        pageInfo: data.Page.pageInfo,
      };
    },
    enabled: !!(params.search || params.genres?.length || params.tags?.length || params.year || params.season || params.format || params.status || params.sort?.length),
    staleTime: 5 * 60 * 1000,
  });
}

// Genres
export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const data = await fetchAniList<GenresResponse>(GENRES_QUERY);
      return data.GenreCollection;
    },
    staleTime: 60 * 60 * 1000, // 1 hour - genres rarely change
  });
}

// Combined Homepage Data - Reduces 5 API calls to 1
interface HomepageResponse {
  trending: { media: Media[] };
  popular: { media: Media[] };
  thisSeason: { media: Media[] };
  topRated: { media: Media[] };
  recentlyUpdated: { airingSchedules: AiringScheduleWithMedia[] };
}

export function useHomepageData() {
  const { season, year } = getCurrentSeason();
  
  return useQuery({
    queryKey: ['homepage-data', season, year],
    queryFn: async () => {
      const data = await fetchAniList<HomepageResponse>(HOMEPAGE_QUERY, {
        season,
        seasonYear: year,
      });
      
      // Process recently updated to extract unique media
      const seenIds = new Set<number>();
      const recentlyUpdatedMedia: Media[] = [];
      
      for (const schedule of data.recentlyUpdated.airingSchedules || []) {
        if (schedule.media && !seenIds.has(schedule.media.id)) {
          seenIds.add(schedule.media.id);
          recentlyUpdatedMedia.push(schedule.media);
        }
      }
      
      return {
        trending: data.trending.media || [],
        popular: data.popular.media || [],
        thisSeason: data.thisSeason.media || [],
        topRated: data.topRated.media || [],
        recentlyUpdated: recentlyUpdatedMedia,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
