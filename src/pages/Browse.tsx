import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, Grid3X3, List, Search, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimeCard, AnimeCardSkeleton } from '@/components/anime';
import { useSearchAnime } from '@/hooks/useAnime';
import { cn } from '@/lib/utils';
import { GENRES, TAGS, SEASONS, FORMATS, STATUSES, SORT_OPTIONS, YEARS } from '@/lib/constants';
import { SEO } from '@/components/seo';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tagSearch, setTagSearch] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);
  const [genreExpanded, setGenreExpanded] = useState(true);
  const [tagExpanded, setTagExpanded] = useState(true);
  
  // Get filter values from URL
  const selectedGenres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const selectedYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
  const selectedSeason = searchParams.get('season') || undefined;
  const selectedFormat = searchParams.get('format') || undefined;
  const selectedStatus = searchParams.get('status') || undefined;
  const selectedSort = searchParams.get('sort') || 'POPULARITY_DESC';
  const page = parseInt(searchParams.get('page') || '1');

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    if (!tagSearch) return showAllTags ? TAGS : TAGS.slice(0, 30);
    return TAGS.filter(tag => 
      tag.toLowerCase().includes(tagSearch.toLowerCase())
    );
  }, [tagSearch, showAllTags]);
  
  const { data, isLoading } = useSearchAnime({
    genres: selectedGenres.length > 0 ? selectedGenres : undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    year: selectedYear,
    season: selectedSeason,
    format: selectedFormat,
    status: selectedStatus,
    sort: [selectedSort],
    page,
    perPage: 24,
  });

  const updateFilter = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    
    const newParams = new URLSearchParams(searchParams);
    if (newGenres.length > 0) {
      newParams.set('genres', newGenres.join(','));
    } else {
      newParams.delete('genres');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    const newParams = new URLSearchParams(searchParams);
    if (newTags.length > 0) {
      newParams.set('tags', newTags.join(','));
    } else {
      newParams.delete('tags');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({ sort: selectedSort });
  };

  const activeFilterCount = [
    selectedGenres.length > 0,
    selectedTags.length > 0,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Genres */}
      <Collapsible open={genreExpanded} onOpenChange={setGenreExpanded}>
        <CollapsibleTrigger className="flex items-center justify-between w-full font-medium mb-3 hover:text-primary transition-colors">
          <span>Genres ({GENRES.length})</span>
          {genreExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <Badge
                key={genre}
                variant={selectedGenres.includes(genre) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Tags */}
      <Collapsible open={tagExpanded} onOpenChange={setTagExpanded}>
        <CollapsibleTrigger className="flex items-center justify-between w-full font-medium mb-3 hover:text-primary transition-colors">
          <span className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tags ({TAGS.length})
          </span>
          {tagExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3">
            {/* Tag Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pb-2 border-b border-border">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="cursor-pointer gap-1"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Tag List */}
            <ScrollArea className={cn("pr-4", tagSearch ? "h-64" : showAllTags ? "h-80" : "h-auto")}>
              <div className="flex flex-wrap gap-1.5">
                {filteredTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-muted text-xs transition-colors"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {!tagSearch && !showAllTags && TAGS.length > 30 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setShowAllTags(true)}
                >
                  Show all {TAGS.length} tags
                </Button>
              )}
            </ScrollArea>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Year */}
      <div>
        <h3 className="font-medium mb-3">Year</h3>
        <Select
          value={selectedYear?.toString() || 'any'}
          onValueChange={(v) => updateFilter('year', v === 'any' ? undefined : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any year</SelectItem>
            {YEARS.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Season */}
      <div>
        <h3 className="font-medium mb-3">Season</h3>
        <div className="grid grid-cols-2 gap-2">
          {SEASONS.map((season) => (
            <Button
              key={season}
              variant={selectedSeason === season ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('season', selectedSeason === season ? undefined : season)}
              className="capitalize"
            >
              {season.toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <h3 className="font-medium mb-3">Format</h3>
        <div className="grid grid-cols-2 gap-2">
          {FORMATS.map((format) => (
            <Button
              key={format.value}
              variant={selectedFormat === format.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('format', selectedFormat === format.value ? undefined : format.value)}
            >
              {format.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="font-medium mb-3">Airing Status</h3>
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map((status) => (
            <Button
              key={status.value}
              variant={selectedStatus === status.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('status', selectedStatus === status.value ? undefined : status.value)}
              className="text-xs"
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button variant="destructive" className="w-full" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  // Build dynamic SEO title
  const seoTitle = [
    selectedGenres.length > 0 ? selectedGenres.slice(0, 2).join(', ') : null,
    selectedTags.length > 0 ? selectedTags.slice(0, 2).join(', ') : null,
    selectedYear ? selectedYear.toString() : null,
    selectedSeason ? selectedSeason.charAt(0) + selectedSeason.slice(1).toLowerCase() : null,
  ].filter(Boolean).join(' • ') || 'Browse Anime';

  return (
    <>
      <SEO 
        title={seoTitle}
        description={`Browse and discover anime${selectedGenres.length > 0 ? ` in ${selectedGenres.join(', ')}` : ''}${selectedYear ? ` from ${selectedYear}` : ''}. Filter by genre, tags, year, season, and more.`}
        keywords={['anime', 'browse', ...selectedGenres, ...selectedTags]}
      />
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Anime</h1>
          <p className="text-muted-foreground">
            {data?.pageInfo?.total ? `${data.pageInfo.total.toLocaleString()} results` : 'Explore anime'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
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

          {/* Sort */}
          <Select
            value={selectedSort}
            onValueChange={(v) => updateFilter('sort', v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedGenres.length > 0 || selectedTags.length > 0 || selectedYear || selectedSeason || selectedFormat || selectedStatus) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedGenres.map((genre) => (
            <Badge key={genre} variant="secondary" className="gap-1">
              {genre}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleGenre(genre)} />
            </Badge>
          ))}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              <Tag className="w-3 h-3" />
              {tag}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleTag(tag)} />
            </Badge>
          ))}
          {selectedYear && (
            <Badge variant="secondary" className="gap-1">
              {selectedYear}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('year', undefined)} />
            </Badge>
          )}
          {selectedSeason && (
            <Badge variant="secondary" className="gap-1 capitalize">
              {selectedSeason.toLowerCase()}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('season', undefined)} />
            </Badge>
          )}
          {selectedFormat && (
            <Badge variant="secondary" className="gap-1">
              {FORMATS.find(f => f.value === selectedFormat)?.label || selectedFormat}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('format', undefined)} />
            </Badge>
          )}
          {selectedStatus && (
            <Badge variant="secondary" className="gap-1">
              {STATUSES.find(s => s.value === selectedStatus)?.label || selectedStatus}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('status', undefined)} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h2>
            <ScrollArea className="h-[calc(100vh-180px)] pr-4">
              <FilterContent />
            </ScrollArea>
          </div>
        </aside>

        {/* Grid or List View */}
        <div className="flex-1">
          {isLoading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} variant="list" />
                ))}
              </div>
            )
          ) : data?.media && data.media.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {data.media.map((anime, index) => (
                    <AnimeCard key={anime.id} anime={anime} index={index} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {data.media.map((anime, index) => (
                    <AnimeCard key={anime.id} anime={anime} index={index} variant="list" />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {data.pageInfo && data.pageInfo.lastPage && data.pageInfo.lastPage > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={page <= 1}
                    onClick={() => updateFilter('page', (page - 1).toString())}
                    className="gap-2"
                  >
                    ← Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, data.pageInfo.lastPage) }, (_, i) => {
                      let pageNum: number;
                      const lastPage = data.pageInfo!.lastPage!;
                      if (lastPage <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= lastPage - 2) {
                        pageNum = lastPage - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => updateFilter('page', pageNum.toString())}
                          className="w-10 h-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    disabled={!data.pageInfo.hasNextPage}
                    onClick={() => updateFilter('page', (page + 1).toString())}
                    className="gap-2"
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl font-medium mb-2">No anime found</p>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Browse;
