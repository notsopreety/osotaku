import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Loader2, TrendingUp, Grid3X3, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimeCard, AnimeCardSkeleton } from '@/components/anime';
import { useSearchAnime, useTrendingAnime, useGenres } from '@/hooks/useAnime';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/seo';
import type { Media } from '@/types/anime';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  const page = parseInt(searchParams.get('page') || '1');

  // Search results
  const { data: searchResults, isLoading: isSearching } = useSearchAnime({
    search: debouncedQuery.length >= 2 ? debouncedQuery : undefined,
    page,
    perPage: 24,
  });

  // Quick suggestions (for autocomplete)
  const { data: suggestions, isLoading: isSuggestionsLoading } = useSearchAnime({
    search: query.length >= 2 && isFocused ? query : undefined,
    perPage: 6,
  });

  // Trending for empty state
  const { data: trending } = useTrendingAnime(1, 12);
  const { data: genres } = useGenres();

  // Sync URL with search
  useEffect(() => {
    if (debouncedQuery) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('q', debouncedQuery);
      if (page === 1) newParams.delete('page');
      setSearchParams(newParams, { replace: true });
    } else if (searchParams.has('q')) {
      searchParams.delete('q');
      setSearchParams(searchParams, { replace: true });
    }
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (anime: Media) => {
    setQuery(anime.title?.english || anime.title?.romaji || '');
    setIsFocused(false);
  };

  const clearSearch = () => {
    setQuery('');
    searchParams.delete('q');
    setSearchParams(searchParams);
    inputRef.current?.focus();
  };

  const updatePage = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', newPage.toString());
    }
    setSearchParams(newParams);
  };

  const showSuggestions = isFocused && query.length >= 2 && suggestions?.media && suggestions.media.length > 0;
  const hasResults = debouncedQuery.length >= 2 && searchResults?.media;

  return (
    <>
      <SEO 
        title={debouncedQuery ? `Search: ${debouncedQuery}` : 'Search Anime'}
        description={debouncedQuery ? `Search results for "${debouncedQuery}" - find anime by title, character, or studio.` : 'Search for anime by title, character, or studio. Discover your next favorite series.'}
        keywords={['anime search', 'find anime', debouncedQuery].filter(Boolean) as string[]}
      />
      <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Search Anime
        </h1>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search by title, character, or studio..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="pl-12 pr-12 h-14 text-lg bg-card border-muted focus:border-primary"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={clearSearch}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50"
              >
                {isSuggestionsLoading ? (
                  <div className="p-4 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {suggestions.media.map((anime) => (
                      <Link
                        key={anime.id}
                        to={`/anime/${anime.id}`}
                        onClick={() => handleSuggestionClick(anime)}
                        className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                      >
                        <img
                          src={anime.coverImage?.medium}
                          alt=""
                          className="w-10 h-14 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {anime.title?.english || anime.title?.romaji}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {anime.format?.replace('_', ' ')} • {anime.seasonYear}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Quick Genre Tags */}
        {!hasResults && genres && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {genres.slice(0, 10).map((genre) => (
              <Link key={genre} to={`/browse?genres=${genre}`}>
                <Badge variant="outline" className="hover:bg-muted cursor-pointer">
                  {genre}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Results or Trending */}
      {hasResults ? (
        <div>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {searchResults.pageInfo?.total?.toLocaleString()} results for "{debouncedQuery}"
            </p>
            
            {/* View Mode Toggle */}
            <div className="flex gap-1 border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results Grid/List */}
          {isSearching ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} variant="list" />
                ))}
              </div>
            )
          ) : searchResults.media.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {searchResults.media.map((anime, index) => (
                    <AnimeCard key={anime.id} anime={anime} index={index} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {searchResults.media.map((anime, index) => (
                    <AnimeCard key={anime.id} anime={anime} index={index} variant="list" />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {searchResults.pageInfo && searchResults.pageInfo.lastPage && searchResults.pageInfo.lastPage > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => updatePage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="px-4 text-sm text-muted-foreground">
                    Page {page} of {searchResults.pageInfo.lastPage}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!searchResults.pageInfo.hasNextPage}
                    onClick={() => updatePage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl font-medium mb-2">No results found</p>
              <p className="text-muted-foreground">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Trending Section (Empty State) */
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Trending Right Now</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trending?.media.map((anime, index) => (
              <AnimeCard key={anime.id} anime={anime} index={index} />
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Search;
