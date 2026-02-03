// AniList GraphQL API Client

const ANILIST_API_URL = 'https://graphql.anilist.co';

export async function fetchAniList<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
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

// Media fragment for reuse
export const MEDIA_FRAGMENT = `
  fragment MediaFields on Media {
    id
    idMal
    title {
      romaji
      english
      native
      userPreferred
    }
    description(asHtml: false)
    format
    status
    episodes
    duration
    season
    seasonYear
    averageScore
    meanScore
    popularity
    trending
    favourites
    genres
    coverImage {
      extraLarge
      large
      medium
      color
    }
    bannerImage
    nextAiringEpisode {
      id
      airingAt
      timeUntilAiring
      episode
    }
    isAdult
  }
`;

export const MEDIA_DETAILS_FRAGMENT = `
  fragment MediaDetailsFields on Media {
    id
    idMal
    title {
      romaji
      english
      native
      userPreferred
    }
    description(asHtml: false)
    format
    status
    episodes
    duration
    season
    seasonYear
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    averageScore
    meanScore
    popularity
    trending
    favourites
    genres
    tags {
      id
      name
      description
      category
      rank
      isGeneralSpoiler
      isMediaSpoiler
    }
    rankings {
      id
      rank
      type
      format
      year
      season
      allTime
      context
    }
    stats {
      scoreDistribution {
        score
        amount
      }
      statusDistribution {
        status
        amount
      }
    }
    studios {
      edges {
        node {
          id
          name
          isAnimationStudio
          siteUrl
        }
        isMain
      }
    }
    source
    hashtag
    synonyms
    countryOfOrigin
    coverImage {
      extraLarge
      large
      medium
      color
    }
    bannerImage
    trailer {
      id
      site
      thumbnail
    }
    characters(page: 1, perPage: 12, sort: [ROLE, RELEVANCE]) {
      edges {
        node {
          id
          name {
            full
            native
          }
          image {
            large
            medium
          }
        }
        role
        voiceActors(language: JAPANESE) {
          id
          name {
            full
            native
          }
          image {
            large
            medium
          }
        }
      }
    }
    staff(page: 1, perPage: 8) {
      edges {
        node {
          id
          name {
            full
            native
          }
          image {
            large
            medium
          }
        }
        role
      }
    }
    relations {
      edges {
        node {
          id
          title {
            romaji
            english
          }
          format
          status
          coverImage {
            large
            medium
          }
        }
        relationType
      }
    }
    recommendations(page: 1, perPage: 8, sort: [RATING_DESC]) {
      nodes {
        id
        rating
        mediaRecommendation {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            medium
          }
          averageScore
          format
        }
      }
    }
    externalLinks {
      id
      url
      site
      type
      icon
      color
    }
    nextAiringEpisode {
      id
      airingAt
      timeUntilAiring
      episode
    }
    isAdult
    siteUrl
  }
`;

// Queries
export const TRENDING_ANIME_QUERY = `
  query TrendingAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
        ...MediaFields
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const POPULAR_ANIME_QUERY = `
  query PopularAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        ...MediaFields
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const POPULAR_THIS_SEASON_QUERY = `
  query PopularThisSeason($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: ANIME, sort: POPULARITY_DESC, season: $season, seasonYear: $seasonYear, isAdult: false) {
        ...MediaFields
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const TOP_RATED_ANIME_QUERY = `
  query TopRatedAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
        ...MediaFields
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const RECENTLY_UPDATED_QUERY = `
  query RecentlyUpdated($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      airingSchedules(notYetAired: false, sort: TIME_DESC) {
        id
        episode
        airingAt
        media {
          ...MediaFields
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const ANIME_DETAILS_QUERY = `
  query AnimeDetails($id: Int) {
    Media(id: $id, type: ANIME) {
      ...MediaDetailsFields
    }
  }
  ${MEDIA_DETAILS_FRAGMENT}
`;

export const SEARCH_ANIME_QUERY = `
  query SearchAnime($search: String, $page: Int, $perPage: Int, $genres: [String], $tags: [String], $year: Int, $season: MediaSeason, $format: MediaFormat, $status: MediaStatus, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: ANIME, search: $search, genre_in: $genres, tag_in: $tags, seasonYear: $year, season: $season, format: $format, status: $status, sort: $sort, isAdult: false) {
        ...MediaFields
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const GENRES_QUERY = `
  query Genres {
    GenreCollection
  }
`;

// Combined homepage query - reduces 5 API calls to 1
export const HOMEPAGE_QUERY = `
  query Homepage($season: MediaSeason, $seasonYear: Int) {
    trending: Page(page: 1, perPage: 10) {
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
        ...MediaFields
      }
    }
    popular: Page(page: 1, perPage: 20) {
      media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        ...MediaFields
      }
    }
    thisSeason: Page(page: 1, perPage: 20) {
      media(type: ANIME, sort: POPULARITY_DESC, season: $season, seasonYear: $seasonYear, isAdult: false) {
        ...MediaFields
      }
    }
    topRated: Page(page: 1, perPage: 20) {
      media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
        ...MediaFields
      }
    }
    recentlyUpdated: Page(page: 1, perPage: 20) {
      airingSchedules(notYetAired: false, sort: TIME_DESC) {
        id
        episode
        airingAt
        media {
          ...MediaFields
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

// Helper to get current season
export function getCurrentSeason(): { season: string; year: number } {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  let season: string;
  if (month >= 0 && month <= 2) {
    season = 'WINTER';
  } else if (month >= 3 && month <= 5) {
    season = 'SPRING';
  } else if (month >= 6 && month <= 8) {
    season = 'SUMMER';
  } else {
    season = 'FALL';
  }

  return { season, year };
}
