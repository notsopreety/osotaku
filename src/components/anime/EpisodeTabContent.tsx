import { Link } from 'react-router-dom';
import { Play, Plus, ExternalLink, Film, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useEpisodes } from '@/hooks/useEpisodes';
import { cn } from '@/lib/utils';
import type { Episode } from '@/types/episode';

interface EpisodeTabContentProps {
  anilistId: number;
  totalEpisodes?: number;
  isMovie?: boolean;
}

const GITHUB_DATA_URL = 'https://github.com/notsopreety/osotaku/tree/main/public/data';

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
}

// Get unique contributors from all episodes
function getContributors(episodes: Episode[]): string[] {
  const contributors = new Set<string>();
  episodes.forEach(ep => {
    ep.sources.forEach(source => {
      contributors.add(source.addedBy);
    });
  });
  return Array.from(contributors);
}

export function EpisodeTabContent({ anilistId, totalEpisodes = 0, isMovie = false }: EpisodeTabContentProps) {
  const { data, isLoading } = useEpisodes(anilistId);
  
  const episodes = data?.episodes || [];
  const hasEpisodes = episodes.length > 0;
  const isComplete = hasEpisodes && episodes.length >= totalEpisodes && totalEpisodes > 0;

  // Smart button logic
  const getButtonInfo = () => {
    if (!hasEpisodes) {
      return {
        text: isMovie ? 'Add Source' : 'Add Episodes',
        url: GITHUB_DATA_URL,
      };
    }
    if (isComplete) {
      return {
        text: isMovie ? 'Edit Source' : 'Edit Episodes',
        url: `${GITHUB_DATA_URL}/${anilistId}.json`,
      };
    }
    return {
      text: 'Add More',
      url: `${GITHUB_DATA_URL}/${anilistId}.json`,
    };
  };

  const buttonInfo = getButtonInfo();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 bg-card rounded-lg p-4">
            <Skeleton className="w-32 sm:w-40 aspect-video rounded shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No episodes - show add button centered
  if (!hasEpisodes) {
    return (
      <div className="bg-card rounded-lg p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Film className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          No {isMovie ? 'Source' : 'Episodes'} Available
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Be the first to contribute! Add {isMovie ? 'a streaming source' : 'episodes'} for this anime.
        </p>
        <Button asChild size="lg">
          <a 
            href={buttonInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            {buttonInfo.text}
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count and action button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">
            {isMovie ? 'Source' : `${episodes.length} Episode${episodes.length !== 1 ? 's' : ''}`}
            {totalEpisodes > 0 && !isMovie && (
              <span className="text-muted-foreground font-normal"> / {totalEpisodes}</span>
            )}
          </h3>
          {totalEpisodes > 0 && !isComplete && !isMovie && (
            <p className="text-xs text-muted-foreground">
              {totalEpisodes - episodes.length} episode{totalEpisodes - episodes.length !== 1 ? 's' : ''} missing
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" asChild>
          <a 
            href={buttonInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {buttonInfo.text}
          </a>
        </Button>
      </div>

      {/* Episode List */}
      <div className="space-y-3">
        {episodes.map((episode, index) => (
          <EpisodeListItem 
            key={episode.epId}
            episode={episode}
            anilistId={anilistId}
            isMovie={isMovie}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

interface EpisodeListItemProps {
  episode: Episode;
  anilistId: number;
  isMovie?: boolean;
  index: number;
}

function EpisodeListItem({ episode, anilistId, isMovie, index }: EpisodeListItemProps) {
  const epNumber = episode.epId.replace('ep-', '');
  
  // Get unique contributors for this episode
  const contributors = [...new Set(episode.sources.map(s => s.addedBy))];
  
  return (
    <Link
      to={`/watch/${anilistId}/${episode.epId}`}
      className="group flex gap-4 bg-card rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative w-28 sm:w-40 aspect-video rounded-lg overflow-hidden bg-muted shrink-0">
        {episode.thumbnail ? (
          <img
            src={episode.thumbnail}
            alt={episode.title || `Episode ${epNumber}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Play className="w-6 h-6 text-primary" />
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
            <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        {episode.duration && (
          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white">
            {formatDuration(episode.duration)}
          </div>
        )}

        {/* Episode number badge */}
        <div className="absolute top-1 left-1 px-2 py-0.5 bg-black/80 rounded text-xs text-white font-medium">
          {isMovie ? 'Source' : `E${epNumber}`}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-1">
        {/* Title */}
        <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
          {isMovie ? 'Watch Now' : `${index + 1}. `}
          {episode.title || `Episode ${epNumber}`}
        </h4>
        
        {/* Description */}
        {episode.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {episode.description}
          </p>
        )}

        {/* Badges and contributor */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {/* Audio badges */}
          {episode.sources.some(s => s.audio === 'sub') && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">SUB</Badge>
          )}
          {episode.sources.some(s => s.audio === 'dub') && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">DUB</Badge>
          )}
          {episode.sources.some(s => s.type === 'hls') && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">HLS</Badge>
          )}

          {/* Contributors */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <User className="w-3 h-3" />
            {contributors.slice(0, 2).map((contributor, i) => (
              <span key={contributor}>
                {i > 0 && ', '}
                <Link 
                  to={`/user/${contributor}`}
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  @{contributor}
                </Link>
              </span>
            ))}
            {contributors.length > 2 && (
              <span className="text-muted-foreground">+{contributors.length - 2}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Smart button component for action area
interface EpisodeActionButtonProps {
  anilistId: number;
  hasEpisodes: boolean;
  localEpisodeCount: number;
  totalEpisodes: number;
  isMovie: boolean;
}

export function EpisodeActionButton({ 
  anilistId, 
  hasEpisodes, 
  localEpisodeCount, 
  totalEpisodes, 
  isMovie 
}: EpisodeActionButtonProps) {
  const isComplete = hasEpisodes && localEpisodeCount >= totalEpisodes && totalEpisodes > 0;

  const getButtonInfo = () => {
    if (!hasEpisodes) {
      return {
        text: isMovie ? 'Add Source' : 'Add Episodes',
        url: GITHUB_DATA_URL,
      };
    }
    if (isComplete) {
      return {
        text: isMovie ? 'Edit Source' : 'Edit Episodes',
        url: `${GITHUB_DATA_URL}/${anilistId}.json`,
      };
    }
    return {
      text: 'Add More',
      url: `${GITHUB_DATA_URL}/${anilistId}.json`,
    };
  };

  const buttonInfo = getButtonInfo();

  return (
    <Button variant="outline" size="sm" asChild className="gap-1.5">
      <a 
        href={buttonInfo.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Plus className="w-4 h-4" />
        {buttonInfo.text}
      </a>
    </Button>
  );
}
