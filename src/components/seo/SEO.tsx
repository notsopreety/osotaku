import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  canonicalUrl?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const DEFAULT_TITLE = 'OsOtaku - Open-Source Anime Discovery & Tracking';
const DEFAULT_DESCRIPTION = 'Free, open-source AniList wrapper for discovering and tracking anime. Browse trending titles, sync your watchlist with AniList, and contribute to the community. No ads, no tracking, fully transparent.';
const DEFAULT_IMAGE = '/og-image.png';
const SITE_NAME = 'OsOtaku';

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noindex = false,
  canonicalUrl,
  keywords = ['anime', 'streaming', 'watchlist', 'manga', 'anilist'],
  author,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const imageUrl = image.startsWith('http') ? image : `${typeof window !== 'undefined' ? window.location.origin : ''}${image}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const updateMeta = (selector: string, content: string, attribute = 'content') => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (element) {
        element.setAttribute(attribute, content);
      } else {
        element = document.createElement('meta');
        const [attrName, attrValue] = selector.replace(/[\[\]"']/g, '').split('=');
        if (attrName && attrValue) {
          element.setAttribute(attrName, attrValue);
        }
        element.setAttribute(attribute, content);
        document.head.appendChild(element);
      }
    };

    // Basic meta tags
    updateMeta('meta[name="description"]', description);
    updateMeta('meta[name="keywords"]', keywords.join(', '));
    
    if (author) {
      updateMeta('meta[name="author"]', author);
    }
    
    if (noindex) {
      updateMeta('meta[name="robots"]', 'noindex, nofollow');
    } else {
      updateMeta('meta[name="robots"]', 'index, follow');
    }

    // Open Graph tags
    updateMeta('meta[property="og:title"]', fullTitle);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:image"]', imageUrl);
    updateMeta('meta[property="og:url"]', currentUrl);
    updateMeta('meta[property="og:type"]', type);
    updateMeta('meta[property="og:site_name"]', SITE_NAME);
    updateMeta('meta[property="og:locale"]', 'en_US');

    if (publishedTime) {
      updateMeta('meta[property="article:published_time"]', publishedTime);
    }
    if (modifiedTime) {
      updateMeta('meta[property="article:modified_time"]', modifiedTime);
    }

    // Twitter Card tags
    updateMeta('meta[name="twitter:card"]', 'summary_large_image');
    updateMeta('meta[name="twitter:title"]', fullTitle);
    updateMeta('meta[name="twitter:description"]', description);
    updateMeta('meta[name="twitter:image"]', imageUrl);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl || currentUrl;

    // Cleanup function
    return () => {
      // Reset to defaults on unmount if needed
    };
  }, [fullTitle, description, imageUrl, currentUrl, type, noindex, canonicalUrl, keywords, author, publishedTime, modifiedTime]);

  return null;
}

// JSON-LD structured data component
interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'json-ld-structured-data';
    
    // Remove existing script if present
    const existing = document.getElementById('json-ld-structured-data');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data]);

  return null;
}

// Anime-specific JSON-LD generator
export function generateAnimeJsonLd(anime: {
  title: string;
  description?: string;
  image?: string;
  rating?: number;
  datePublished?: string;
  genre?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: anime.title,
    description: anime.description,
    image: anime.image,
    aggregateRating: anime.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: anime.rating,
          bestRating: 10,
          worstRating: 0,
        }
      : undefined,
    datePublished: anime.datePublished,
    genre: anime.genre,
  };
}

// Website JSON-LD
export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  url: typeof window !== 'undefined' ? window.location.origin : '',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${typeof window !== 'undefined' ? window.location.origin : ''}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};
