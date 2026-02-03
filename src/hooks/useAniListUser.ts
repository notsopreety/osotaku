import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, fetchAniListAuth } from '@/contexts/AuthContext';
import type { MediaListCollection, MediaList, MediaListStatus } from '@/types/anime';

// Queries
const USER_ANIME_LIST_QUERY = `
  query UserAnimeList($userId: Int, $status: MediaListStatus) {
    MediaListCollection(userId: $userId, type: ANIME, status: $status) {
      lists {
        name
        status
        entries {
          id
          mediaId
          status
          score
          progress
          repeat
          notes
          startedAt {
            year
            month
            day
          }
          completedAt {
            year
            month
            day
          }
          updatedAt
          media {
            id
            title {
              romaji
              english
            }
            episodes
            coverImage {
              large
              medium
            }
            format
            status
            averageScore
          }
        }
      }
      user {
        id
        name
        avatar {
          large
        }
      }
    }
  }
`;

const USER_FAVORITES_QUERY = `
  query UserFavorites($userId: Int, $page: Int) {
    User(id: $userId) {
      favourites {
        anime(page: $page, perPage: 25) {
          nodes {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
              medium
            }
            format
            averageScore
          }
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
          }
        }
      }
    }
  }
`;

// Mutations
const SAVE_MEDIA_LIST_ENTRY = `
  mutation SaveMediaListEntry(
    $mediaId: Int!
    $status: MediaListStatus
    $score: Float
    $progress: Int
    $repeat: Int
    $notes: String
    $startedAt: FuzzyDateInput
    $completedAt: FuzzyDateInput
  ) {
    SaveMediaListEntry(
      mediaId: $mediaId
      status: $status
      score: $score
      progress: $progress
      repeat: $repeat
      notes: $notes
      startedAt: $startedAt
      completedAt: $completedAt
    ) {
      id
      mediaId
      status
      score
      progress
      repeat
      notes
      startedAt {
        year
        month
        day
      }
      completedAt {
        year
        month
        day
      }
    }
  }
`;

const DELETE_MEDIA_LIST_ENTRY = `
  mutation DeleteMediaListEntry($id: Int!) {
    DeleteMediaListEntry(id: $id) {
      deleted
    }
  }
`;

const TOGGLE_FAVORITE = `
  mutation ToggleFavorite($animeId: Int) {
    ToggleFavourite(animeId: $animeId) {
      anime {
        nodes {
          id
        }
      }
    }
  }
`;

// Hooks
export function useUserAnimeList(status?: MediaListStatus) {
  const { user, token } = useAuth();
  
  return useQuery({
    queryKey: ['user-anime-list', user?.id, status],
    queryFn: async () => {
      if (!user || !token) throw new Error('Not authenticated');
      
      const data = await fetchAniListAuth<{ MediaListCollection: MediaListCollection }>(
        USER_ANIME_LIST_QUERY,
        { userId: user.id, status },
        token
      );
      
      return data.MediaListCollection;
    },
    enabled: !!user && !!token,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserFavorites(page = 1) {
  const { user, token } = useAuth();
  
  return useQuery({
    queryKey: ['user-favorites', user?.id, page],
    queryFn: async () => {
      if (!user || !token) throw new Error('Not authenticated');
      
      const data = await fetchAniListAuth<{ User: { favourites: { anime: any } } }>(
        USER_FAVORITES_QUERY,
        { userId: user.id, page },
        token
      );
      
      return data.User.favourites.anime;
    },
    enabled: !!user && !!token,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveMediaListEntry() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (variables: {
      mediaId: number;
      status?: MediaListStatus;
      score?: number;
      progress?: number;
      repeat?: number;
      notes?: string;
      startedAt?: { year?: number; month?: number; day?: number };
      completedAt?: { year?: number; month?: number; day?: number };
    }) => {
      if (!token) throw new Error('Not authenticated');
      
      // Clean up the variables - remove undefined/empty values and format properly
      const cleanVariables: Record<string, unknown> = {
        mediaId: variables.mediaId,
      };
      
      if (variables.status) cleanVariables.status = variables.status;
      if (variables.score !== undefined && variables.score > 0) cleanVariables.score = variables.score;
      if (variables.progress !== undefined) cleanVariables.progress = variables.progress;
      if (variables.repeat !== undefined && variables.repeat > 0) cleanVariables.repeat = variables.repeat;
      if (variables.notes && variables.notes.trim()) cleanVariables.notes = variables.notes.trim();
      
      // Only include dates if they have valid year values
      if (variables.startedAt?.year) {
        cleanVariables.startedAt = {
          year: variables.startedAt.year,
          month: variables.startedAt.month || null,
          day: variables.startedAt.day || null,
        };
      }
      
      if (variables.completedAt?.year) {
        cleanVariables.completedAt = {
          year: variables.completedAt.year,
          month: variables.completedAt.month || null,
          day: variables.completedAt.day || null,
        };
      }
      
      console.log('Saving entry with variables:', cleanVariables);
      
      const data = await fetchAniListAuth<{ SaveMediaListEntry: MediaList }>(
        SAVE_MEDIA_LIST_ENTRY,
        cleanVariables,
        token
      );
      
      console.log('Save response:', data);
      
      return data.SaveMediaListEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-anime-list'] });
    },
  });
}

export function useDeleteMediaListEntry() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('Not authenticated');
      
      await fetchAniListAuth<{ DeleteMediaListEntry: { deleted: boolean } }>(
        DELETE_MEDIA_LIST_ENTRY,
        { id },
        token
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-anime-list'] });
    },
  });
}

export function useToggleFavorite() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (animeId: number) => {
      if (!token) throw new Error('Not authenticated');
      
      await fetchAniListAuth<{ ToggleFavourite: any }>(
        TOGGLE_FAVORITE,
        { animeId },
        token
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
    },
  });
}

// Get media list status for a specific anime
export function useMediaListEntry(mediaId: number) {
  const { data: lists } = useUserAnimeList();
  
  if (!lists?.lists) return null;
  
  for (const list of lists.lists) {
    const entry = list.entries?.find(e => e.mediaId === mediaId);
    if (entry) return entry;
  }
  
  return null;
}

// Hook to check if anime is in user's list (returns status or null)
export function useUserListStatus(mediaId: number): MediaListStatus | null {
  const { data: lists } = useUserAnimeList();
  
  if (!lists?.lists) return null;
  
  for (const list of lists.lists) {
    const entry = list.entries?.find(e => e.mediaId === mediaId);
    if (entry) return entry.status || null;
  }
  
  return null;
}

// Hook to check if anime is in user's favorites
export function useUserFavoriteStatus(mediaId: number): boolean {
  const { data: favorites } = useUserFavorites();
  
  if (!favorites?.nodes) return false;
  
  return favorites.nodes.some((anime: any) => anime.id === mediaId);
}
