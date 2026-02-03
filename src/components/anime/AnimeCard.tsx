import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Tv, Film, Clock, Calendar, Users, Heart, CheckCircle, Eye, ListPlus, PauseCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { Media } from '@/types/anime';
import { cn, formatAiringTime } from '@/lib/utils';
import { useUserListStatus, useUserFavoriteStatus } from '@/hooks/useAniListUser';

interface AnimeCardProps {
  anime: Media;
  index?: number;
  variant?: 'default' | 'large' | 'compact' | 'list';
}

const STATUS_ICONS = {
  CURRENT: Eye,
  PLANNING: ListPlus,
  COMPLETED: CheckCircle,
  PAUSED: PauseCircle,
  DROPPED: PauseCircle,
  REPEATING: Eye,
};

const STATUS_LABELS: Record<string, string> = {
  CURRENT: 'Watching',
  PLANNING: 'Planning',
  COMPLETED: 'Completed',
  PAUSED: 'Paused',
  DROPPED: 'Dropped',
  REPEATING: 'Rewatching',
};

export function AnimeCard({ anime, index = 0, variant = 'default' }: AnimeCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const listStatus = useUserListStatus(anime.id);
  const isFavorite = useUserFavoriteStatus(anime.id);
  
  const title = anime.title?.english || anime.title?.romaji || 'Unknown';
  const coverImage = anime.coverImage?.large || anime.coverImage?.medium;
  const accentColor = anime.coverImage?.color || 'hsl(var(--primary))';
  
  const formatIcons: Record<string, typeof Tv> = {
    TV: Tv,
    MOVIE: Film,
    TV_SHORT: Tv,
    OVA: Tv,
    ONA: Tv,
  };
  const FormatIcon = formatIcons[anime.format || 'TV'] || Tv;

  const airingText = anime.nextAiringEpisode
    ? `Ep ${anime.nextAiringEpisode.episode} in ${formatAiringTime(anime.nextAiringEpisode.timeUntilAiring)}`
    : null;

  const statusLabels: Record<string, string> = {
    FINISHED: 'Finished',
    RELEASING: 'Airing',
    NOT_YET_RELEASED: 'Upcoming',
    CANCELLED: 'Cancelled',
    HIATUS: 'Hiatus',
  };

  const StatusIcon = listStatus ? STATUS_ICONS[listStatus] : null;

  // List view
  if (variant === 'list') {
    return (
      <div 
        className="relative bg-card hover:bg-accent/50 rounded-lg overflow-hidden transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/anime/${anime.id}`} className="flex gap-4 p-3">
          <div className="shrink-0 w-24 h-36 rounded-md overflow-hidden relative">
            {coverImage ? (
              <img
                src={coverImage}
                alt={title}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
                  isHovered && "scale-105"
                )}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Tv className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            {/* List/Favorite Badges */}
            {(listStatus || isFavorite) && (
              <div className="absolute top-1 left-1 flex flex-col gap-1">
                {isFavorite && (
                  <div className="bg-destructive rounded-full p-1">
                    <Heart className="w-3 h-3 text-destructive-foreground fill-current" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 py-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "font-semibold text-base line-clamp-1 transition-colors",
                  isHovered && "text-primary"
                )}>
                  {title}
                </h3>
                {listStatus && StatusIcon && (
                  <Badge variant="secondary" className="text-xs gap-1 shrink-0">
                    <StatusIcon className="w-3 h-3" />
                    {STATUS_LABELS[listStatus]}
                  </Badge>
                )}
              </div>
              {anime.averageScore && (
                <div className="flex items-center gap-1 shrink-0 bg-primary/10 px-2 py-0.5 rounded text-sm font-medium">
                  <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                  {(anime.averageScore / 10).toFixed(1)}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs gap-1">
                <FormatIcon className="w-3 h-3" />
                {anime.format?.replace('_', ' ')}
              </Badge>
              {anime.status && (
                <Badge 
                  variant={anime.status === 'RELEASING' ? 'default' : 'secondary'} 
                  className="text-xs"
                >
                  {statusLabels[anime.status]}
                </Badge>
              )}
              {anime.episodes && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Tv className="w-3 h-3" />
                  {anime.episodes} eps
                </span>
              )}
              {anime.seasonYear && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {anime.season} {anime.seasonYear}
                </span>
              )}
              {anime.popularity && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {anime.popularity.toLocaleString()}
                </span>
              )}
            </div>

            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {anime.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {anime.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                {anime.description.replace(/<[^>]*>/g, '')}
              </p>
            )}

            {airingText && (
              <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                <Clock className="w-3 h-3" />
                {airingText}
              </div>
            )}
          </div>
        </Link>
      </div>
    );
  }

  // Compact view
  if (variant === 'compact') {
    return (
      <div 
        className="flex gap-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/anime/${anime.id}`} className="shrink-0">
          <div className="w-16 h-24 rounded-md overflow-hidden relative">
            {coverImage ? (
              <img
                src={coverImage}
                alt={title}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
                  isHovered && "scale-105"
                )}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Tv className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            {isFavorite && (
              <div className="absolute top-1 left-1 bg-destructive rounded-full p-0.5">
                <Heart className="w-2.5 h-2.5 text-destructive-foreground fill-current" />
              </div>
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0 py-1">
          <Link to={`/anime/${anime.id}`}>
            <h3 className={cn(
              "font-medium text-sm line-clamp-1 transition-colors",
              isHovered && "text-primary"
            )}>
              {title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            {anime.averageScore && (
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-primary fill-primary" />
                {(anime.averageScore / 10).toFixed(1)}
              </span>
            )}
            {anime.format && <span>{anime.format.replace('_', ' ')}</span>}
            {listStatus && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {STATUS_LABELS[listStatus]}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default grid view - clean and minimal
  const isAiring = anime.status === 'RELEASING';
  const hasHighScore = anime.averageScore && anime.averageScore >= 80;
  
  return (
    <TooltipProvider>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative',
          variant === 'large' && 'col-span-2 row-span-2'
        )}
      >
        <Link to={`/anime/${anime.id}`} className="block">
          <div 
            className="relative overflow-hidden rounded-xl transition-shadow duration-300"
            style={{
              boxShadow: isHovered ? `0 8px 24px -8px ${accentColor}50` : 'none',
            }}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={title}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-300",
                    isHovered && "scale-105",
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  loading="lazy"
                  onLoad={() => setIsImageLoaded(true)}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Tv className="w-10 h-10 text-muted-foreground" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Top Left - User Status Badges */}
              <div className="absolute top-0 left-0 p-2.5 flex flex-col gap-1">
                {isFavorite && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-destructive rounded-full p-1.5 shadow-lg">
                        <Heart className="w-3.5 h-3.5 text-destructive-foreground fill-current" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Favorited</TooltipContent>
                  </Tooltip>
                )}
                {listStatus && StatusIcon && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-secondary rounded-full p-1.5 shadow-lg">
                        <StatusIcon className="w-3.5 h-3.5 text-secondary-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{STATUS_LABELS[listStatus]}</TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Top Right Badges */}
              <div className="absolute top-0 right-0 p-2.5 flex flex-col items-end gap-1">
                {anime.averageScore && (
                  <div 
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold backdrop-blur-sm",
                      hasHighScore 
                        ? "bg-primary/90 text-primary-foreground" 
                        : "bg-background/70 text-foreground"
                    )}
                  >
                    <Star className={cn("w-3 h-3", hasHighScore && "fill-current")} />
                    {(anime.averageScore / 10).toFixed(1)}
                  </div>
                )}

                <div className="flex items-center gap-1 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
                  <FormatIcon className="w-3 h-3" />
                  {anime.format?.replace('_', ' ')}
                </div>
                
                {isAiring && (
                  <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium">
                    <span className="w-1.5 h-1.5 bg-current rounded-full" />
                    Airing
                  </div>
                )}
              </div>

              {/* Play Button */}
              <div 
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
              >
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full bg-primary hover:bg-primary shadow-lg"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </Button>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 space-y-1.5">
                {airingText && (
                  <div className="flex items-center gap-1 bg-secondary/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-secondary-foreground">
                    <Clock className="w-3 h-3" />
                    {airingText}
                  </div>
                )}

                <div 
                  className={cn(
                    "flex flex-wrap gap-1 transition-opacity duration-200",
                    isHovered ? "opacity-100" : "opacity-0"
                  )}
                >
                  {anime.genres?.slice(0, 2).map((genre) => (
                    <span
                      key={genre}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/20 backdrop-blur-sm text-foreground font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2.5 px-0.5">
            <h3 className={cn(
              "font-semibold text-sm line-clamp-2 leading-tight transition-colors",
              isHovered && "text-primary"
            )}>
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              {anime.seasonYear && <span>{anime.seasonYear}</span>}
              {anime.episodes && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{anime.episodes} eps</span>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>
    </TooltipProvider>
  );
}

export function AnimeCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'large' | 'compact' | 'list' }) {
  if (variant === 'list') {
    return (
      <div className="flex gap-4 p-3 bg-card rounded-lg">
        <Skeleton className="w-24 h-36 rounded-md shrink-0" />
        <div className="flex-1 py-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex gap-3">
        <Skeleton className="w-16 h-24 rounded-md shrink-0" />
        <div className="flex-1 py-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(variant === 'large' && 'col-span-2 row-span-2')}>
      <Skeleton className="aspect-[3/4] rounded-xl" />
      <div className="mt-2.5 space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
