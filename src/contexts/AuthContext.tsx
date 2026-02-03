import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, MediaList, MediaListCollection } from '@/types/anime';
import { fetchAniList } from '@/lib/anilist';

// AniList OAuth Config - User must register their own app at https://anilist.co/settings/developer
const ANILIST_AUTH_URL = 'https://anilist.co/api/v2/oauth/authorize';
const ANILIST_TOKEN_KEY = 'anilist_token';
const ANILIST_CLIENT_ID_KEY = 'anilist_client_id';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  setClientId: (clientId: string) => void;
  clientId: string | null;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// GraphQL Queries for authenticated user
const VIEWER_QUERY = `
  query Viewer {
    Viewer {
      id
      name
      about
      avatar {
        large
        medium
      }
      bannerImage
      statistics {
        anime {
          count
          meanScore
          standardDeviation
          minutesWatched
          episodesWatched
        }
      }
      siteUrl
    }
  }
`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [clientId, setClientIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and client ID from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(ANILIST_TOKEN_KEY);
    const storedClientId = localStorage.getItem(ANILIST_CLIENT_ID_KEY);
    
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedClientId) {
      setClientIdState(storedClientId);
    }
    
    setIsLoading(false);
  }, []);

  // Fetch user data when token is available
  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token]);

  // Handle OAuth callback - check for token in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        localStorage.setItem(ANILIST_TOKEN_KEY, accessToken);
        setToken(accessToken);
        
        // Clean URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  const fetchUser = async (accessToken: string) => {
    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query: VIEWER_QUERY }),
      });

      const json = await response.json();
      
      if (json.data?.Viewer) {
        setUser(json.data.Viewer);
      } else {
        // Token might be invalid
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    }
  };

  const login = useCallback(() => {
    if (!clientId) {
      console.error('No client ID set. Please configure your AniList OAuth app.');
      return;
    }

    // AniList uses implicit grant (response_type=token) - no client secret needed on frontend
    const authUrl = `${ANILIST_AUTH_URL}?client_id=${clientId}&response_type=token`;
    
    window.location.href = authUrl;
  }, [clientId]);

  const logout = useCallback(() => {
    localStorage.removeItem(ANILIST_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const setClientId = useCallback((id: string) => {
    localStorage.setItem(ANILIST_CLIENT_ID_KEY, id);
    setClientIdState(id);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        setClientId,
        clientId,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Authenticated fetch helper
export async function fetchAniListAuth<T>(
  query: string, 
  variables?: Record<string, unknown>,
  token?: string
): Promise<T> {
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
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'AniList API error');
  }

  return json.data;
}
