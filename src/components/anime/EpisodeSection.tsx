import { Link } from 'react-router-dom';
import { Play, Plus, ExternalLink, Film, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useEpisodes } from '@/hooks/useEpisodes';
import { cn } from '@/lib/utils';
import type { Episode } from '@/types/episode';

interface EpisodeSectionProps {
  anilistId: number;
  isMovie?: boolean;
}

const GITHUB_DATA_URL = 'https://github.com/notsopreety/osotaku/tree/main/public/data';

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
}

export function EpisodeSection({ anilistId, isMovie = false }: EpisodeSectionProps) {
  const { data, isLoading } = useEpisodes(anilistId);
  
  const episodes = data?.episodes || [];
  const hasEpisodes = episodes.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // No episodes - show add button
  if (!hasEpisodes) {
    return (
      <div className="bg-card rounded-lg p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          No {isMovie ? 'Source' : 'Episodes'} Available
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          Be the first to add {isMovie ? 'a source' : 'episodes'} for this anime!
        </p>
        <Button asChild>
          <a 
            href={`${GITHUB_DATA_URL}/${anilistId}.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add {isMovie ? 'Source' : 'Episodes'}
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Film className="w-5 h-5" />
          {isMovie ? 'Source' : `Episodes (${episodes.length})`}
        </h2>
        <Button variant="ghost" size="sm" asChild>
          <a 
            href={`${GITHUB_DATA_URL}/${anilistId}.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Add More
          </a>
        </Button>
      </div>

      {/* Horizontal scrollable list for many episodes */}
      {episodes.length > 8 ? (
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
          <div className="flex gap-3 pb-4">
            {episodes.map((episode, index) => (
              <EpisodeCard 
                key={episode.epId}
                episode={episode}
                anilistId={anilistId}
                isMovie={isMovie}
                index={index}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {episodes.map((episode, index) => (
            <EpisodeCard 
              key={episode.epId}
              episode={episode}
              anilistId={anilistId}
              isMovie={isMovie}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface EpisodeCardProps {
  episode: Episode;
  anilistId: number;
  isMovie?: boolean;
  index: number;
}

function EpisodeCard({ episode, anilistId, isMovie, index }: EpisodeCardProps) {
  const epNumber = episode.epId.replace('ep-', '');
  
  return (
    <Link
      to={`/watch/${anilistId}/${episode.epId}`}
      className="group shrink-0 w-40 sm:w-48 block"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-2">
        {episode.thumbnail ? (
          <img
            src={episode.thumbnail}
            alt={episode.title || `Episode ${epNumber}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Play className="w-8 h-8 text-primary" />
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

      {/* Title */}
      <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
        {episode.title || `Episode ${epNumber}`}
      </p>
      
      {/* Audio badges */}
      <div className="flex gap-1 mt-1">
        {episode.sources.some(s => s.audio === 'sub') && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">SUB</Badge>
        )}
        {episode.sources.some(s => s.audio === 'dub') && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">DUB</Badge>
        )}
        {episode.sources.some(s => s.type === 'hls') && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">HLS</Badge>
        )}
      </div>
    </Link>
  );
}
