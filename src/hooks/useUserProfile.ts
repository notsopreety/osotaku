import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, fetchAniListAuth } from '@/contexts/AuthContext';
import type { UserProfile, UserActivity } from '@/types/user';

/**
 * FULLY CONSOLIDATED USER PROFILE QUERY
 * Fetches ALL profile data in a SINGLE API call:
 * - Profile info, avatar, banner
 * - Statistics (anime count, episodes, scores, genres, studios, formats, statuses)
 * - Favorites (anime)
 * - Follower/Following counts (using Page queries)
 * - Recent activity
 * 
 * This minimizes API requests and prevents rate limiting
 */
const FULL_PROFILE_QUERY = `
  query FullUserProfile($id: Int, $name: String) {
    User(id: $id, name: $name) {
      id
      name
      about(asHtml: false)
      avatar {
        large
        medium
      }
      bannerImage
      isFollowing
      isFollower
      donatorTier
      donatorBadge
      createdAt
      siteUrl
      statistics {
        anime {
          count
          meanScore
          standardDeviation
          minutesWatched
          episodesWatched
          formats {
            format
            count
            meanScore
            minutesWatched
          }
          statuses {
            status
            count
            meanScore
            minutesWatched
          }
          scores {
            score
            count
          }
          genres {
            genre
            count
            meanScore
            minutesWatched
          }
          studios {
            studio {
              id
              name
            }
            count
            meanScore
            minutesWatched
          }
        }
      }
      favourites {
        anime(page: 1, perPage: 25) {
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
        }
      }
    }
  }
`;

/**
 * Query to get social counts and activity after we have the user ID
 * This needs to be separate because followers/following need userId, not name
 */
const SOCIAL_AND_ACTIVITY_QUERY = `
  query SocialAndActivity($userId: Int!) {
    followers: Page(page: 1, perPage: 1) {
      pageInfo {
        total
      }
      followers(userId: $userId) {
        id
      }
    }
    following: Page(page: 1, perPage: 1) {
      pageInfo {
        total
      }
      following(userId: $userId) {
        id
      }
    }
    activities: Page(page: 1, perPage: 10) {
      activities(userId: $userId, type: ANIME_LIST, sort: ID_DESC) {
        ... on ListActivity {
          id
          type
          status
          progress
          createdAt
          media {
            id
            title {
              romaji
              english
            }
            coverImage {
              medium
            }
          }
        }
      }
    }
  }
`;

const USER_FOLLOWERS_QUERY = `
  query UserFollowers($userId: Int!, $page: Int) {
    Page(page: $page, perPage: 25) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      followers(userId: $userId) {
        id
        name
        avatar {
          large
          medium
        }
        isFollowing
        isFollower
      }
    }
  }
`;

const USER_FOLLOWING_QUERY = `
  query UserFollowing($userId: Int!, $page: Int) {
    Page(page: $page, perPage: 25) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      following(userId: $userId) {
        id
        name
        avatar {
          large
          medium
        }
        isFollowing
        isFollower
      }
    }
  }
`;

/**
 * ANIME LIST QUERY - Lazy loaded only when tab is opened
 */
const USER_ANIME_LIST_QUERY = `
  query UserAnimeList($userId: Int!) {
    MediaListCollection(userId: $userId, type: ANIME) {
      lists {
        name
        status
        entries {
          id
          mediaId
          score
          progress
          media {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
              medium
            }
            episodes
            format
            averageScore
            status
          }
        }
      }
    }
  }
`;

const TOGGLE_FOLLOW_MUTATION = `
  mutation ToggleFollow($userId: Int!) {
    ToggleFollow(userId: $userId) {
      id
      isFollowing
    }
  }
`;

interface ConsolidatedProfileData {
  user: UserProfile;
  followerCount: number;
  followingCount: number;
  activities: UserActivity[];
}

// Cache for resolved user IDs (username -> id mapping)
const userIdCache = new Map<string, number>();

/**
 * Main hook - fetches consolidated profile data
 * Uses a two-step approach for maximum efficiency:
 * 1. First call gets user profile (can use username or id)
 * 2. Second call gets social counts + activity (needs userId)
 * Both calls happen in sequence but are cached aggressively
 */
export function useUserProfile(userId?: number, username?: string) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['user-profile-consolidated', userId, username],
    queryFn: async (): Promise<ConsolidatedProfileData> => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Check if we have a cached userId for this username
      let resolvedUserId = userId;
      if (!resolvedUserId && username && userIdCache.has(username)) {
        resolvedUserId = userIdCache.get(username);
      }

      // If we have resolvedUserId, we can make both calls in parallel
      if (resolvedUserId) {
        const [profileResponse, socialResponse] = await Promise.all([
          fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              query: FULL_PROFILE_QUERY,
              variables: { id: resolvedUserId },
            }),
          }),
          fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              query: SOCIAL_AND_ACTIVITY_QUERY,
              variables: { userId: resolvedUserId },
            }),
          }),
        ]);

        const [profileJson, socialJson] = await Promise.all([
          profileResponse.json(),
          socialResponse.json(),
        ]);

        if (profileJson.errors) {
          throw new Error(profileJson.errors[0]?.message || 'Failed to fetch user');
        }

        const user = profileJson.data.User as UserProfile;
        
        return {
          user,
          followerCount: socialJson.data?.followers?.pageInfo?.total || 0,
          followingCount: socialJson.data?.following?.pageInfo?.total || 0,
          activities: socialJson.data?.activities?.activities || [],
        };
      }

      // If we only have username, we need to fetch profile first to get ID
      const profileResponse = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: FULL_PROFILE_QUERY,
          variables: { id: userId, name: username },
        }),
      });
      
      const profileJson = await profileResponse.json();
      
      if (profileJson.errors) {
        throw new Error(profileJson.errors[0]?.message || 'Failed to fetch user');
      }
      
      const user = profileJson.data.User as UserProfile;
      const fetchedUserId = user.id;
      
      // Cache the userId for future requests
      if (username) {
        userIdCache.set(username, fetchedUserId);
      }
      
      // Fetch social counts and activity using resolved user ID
      const socialResponse = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: SOCIAL_AND_ACTIVITY_QUERY,
          variables: { userId: fetchedUserId },
        }),
      });
      
      const socialJson = await socialResponse.json();
      
      return {
        user,
        followerCount: socialJson.data?.followers?.pageInfo?.total || 0,
        followingCount: socialJson.data?.following?.pageInfo?.total || 0,
        activities: socialJson.data?.activities?.activities || [],
      };
    },
    enabled: !!(userId || username),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in garbage collection for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus to reduce API calls
  });
}

/**
 * Followers list - only fetched when modal is opened
 */
export function useUserFollowers(userId: number, page = 1, enabled = false) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['user-followers-list', userId, page],
    queryFn: async () => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: USER_FOLLOWERS_QUERY,
          variables: { userId, page },
        }),
      });
      
      const json = await response.json();
      
      if (json.errors) {
        throw new Error(json.errors[0]?.message || 'Failed to fetch followers');
      }
      
      return {
        users: json.data.Page.followers as UserProfile[],
        pageInfo: json.data.Page.pageInfo,
      };
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Following list - only fetched when modal is opened
 */
export function useUserFollowing(userId: number, page = 1, enabled = false) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['user-following-list', userId, page],
    queryFn: async () => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: USER_FOLLOWING_QUERY,
          variables: { userId, page },
        }),
      });
      
      const json = await response.json();
      
      if (json.errors) {
        throw new Error(json.errors[0]?.message || 'Failed to fetch following');
      }
      
      return {
        users: json.data.Page.following as UserProfile[],
        pageInfo: json.data.Page.pageInfo,
      };
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Anime list - lazy loaded only when anime list tab is opened
 */
export function useUserAnimeListPublic(userId: number, enabled = false) {
  return useQuery({
    queryKey: ['user-anime-list-public', userId],
    queryFn: async () => {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: USER_ANIME_LIST_QUERY,
          variables: { userId },
        }),
      });
      
      const json = await response.json();
      
      if (json.errors) {
        throw new Error(json.errors[0]?.message || 'Failed to fetch anime list');
      }
      
      return json.data.MediaListCollection;
    },
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Activity feed - lazy loaded only when activity tab is opened
 * Note: Initial activity is included in main profile query, this is for pagination
 */
export function useUserActivity(userId: number, page = 1, enabled = false) {
  return useQuery({
    queryKey: ['user-activity', userId, page],
    queryFn: async () => {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query UserActivity($userId: Int, $page: Int) {
              Page(page: $page, perPage: 15) {
                pageInfo {
                  total
                  currentPage
                  hasNextPage
                }
                activities(userId: $userId, type: ANIME_LIST, sort: ID_DESC) {
                  ... on ListActivity {
                    id
                    type
                    status
                    progress
                    createdAt
                    media {
                      id
                      title {
                        romaji
                        english
                      }
                      coverImage {
                        medium
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { userId, page },
        }),
      });
      
      const json = await response.json();
      
      if (json.errors) {
        throw new Error(json.errors[0]?.message || 'Failed to fetch activity');
      }
      
      return {
        activities: json.data.Page.activities as UserActivity[],
        pageInfo: json.data.Page.pageInfo,
      };
    },
    enabled: enabled && !!userId && page > 1, // Only for pages > 1 (page 1 is in main query)
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Toggle follow mutation
 */
export function useToggleFollow() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async (userId: number) => {
      if (!token) throw new Error('Not authenticated');
      
      const response = await fetchAniListAuth(TOGGLE_FOLLOW_MUTATION, { userId }, token);
      return response;
    },
    onSuccess: (_, userId) => {
      // Invalidate profile queries to refresh follow status
      queryClient.invalidateQueries({ queryKey: ['user-profile-consolidated'] });
      queryClient.invalidateQueries({ queryKey: ['user-followers-list', userId] });
      queryClient.invalidateQueries({ queryKey: ['user-following-list', userId] });
    },
  });
}
