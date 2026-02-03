import { useQuery } from '@tanstack/react-query';
import type { EpisodeDataFile, Episode } from '@/types/episode';

async function fetchEpisodeData(anilistId: number): Promise<EpisodeDataFile | null> {
  try {
    const response = await fetch(`/data/${anilistId}.json`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

export function useEpisodes(anilistId: number | undefined) {
  return useQuery({
    queryKey: ['episodes', anilistId],
    queryFn: async () => {
      if (!anilistId) return null;
      return fetchEpisodeData(anilistId);
    },
    enabled: !!anilistId,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useEpisode(anilistId: number | undefined, epId: string | undefined) {
  const { data, isLoading, error } = useEpisodes(anilistId);
  
  const episode = data?.episodes?.find(ep => ep.epId === epId) || null;
  const episodes = data?.episodes || [];
  
  const currentIndex = episodes.findIndex(ep => ep.epId === epId);
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;
  
  return {
    episode,
    episodes,
    prevEpisode,
    nextEpisode,
    currentIndex,
    isLoading,
    error,
  };
}
