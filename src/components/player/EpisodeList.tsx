import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Episode } from '@/types/episode';

interface EpisodeListProps {
  episodes: Episode[];
  anilistId: number;
  currentEpId?: string;
  isMovie?: boolean;
  className?: string;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
}

export function EpisodeList({ 
  episodes, 
  anilistId, 
  currentEpId,
  isMovie = false,
  className 
}: EpisodeListProps) {
  if (episodes.length === 0) return null;

  return (
    <div className={cn("bg-card rounded-lg overflow-hidden", className)}>
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">
          {isMovie ? 'Source' : `Episodes (${episodes.length})`}
        </h3>
      </div>
      <ScrollArea className="max-h-[500px]">
        <div className="divide-y divide-border">
          {episodes.map((episode, index) => {
            const epNumber = episode.epId.replace('ep-', '');
            const isActive = episode.epId === currentEpId;
            
            return (
              <Link
                key={episode.epId}
                to={`/watch/${anilistId}/${episode.epId}`}
                className={cn(
                  "flex gap-3 p-3 hover:bg-accent/50 transition-colors",
                  isActive && "bg-primary/10 hover:bg-primary/20"
                )}
              >
                {/* Thumbnail */}
                <div className="relative shrink-0 w-28 sm:w-36 aspect-video rounded-md overflow-hidden bg-muted">
                  {episode.thumbnail ? (
                    <img
                      src={episode.thumbnail}
                      alt={episode.title || `Episode ${epNumber}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Play className="w-4 h-4 text-primary-foreground fill-current" />
                      </div>
                    </div>
                  )}
                  {episode.duration && (
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white">
                      {formatDuration(episode.duration)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <span className="text-sm text-muted-foreground shrink-0">
                      {isMovie ? 'Source' : `E${epNumber}`}
                    </span>
                    {episode.isFiller && (
                      <Badge variant="outline" className="text-xs">Filler</Badge>
                    )}
                  </div>
                  {episode.title && (
                    <p className={cn(
                      "font-medium text-sm mt-0.5 line-clamp-1",
                      isActive && "text-primary"
                    )}>
                      {episode.title}
                    </p>
                  )}
                  {episode.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {episode.description}
                    </p>
                  )}
                  
                  {/* Audio badges */}
                  <div className="flex gap-1 mt-2">
                    {episode.sources.some(s => s.audio === 'sub') && (
                      <Badge variant="secondary" className="text-xs">SUB</Badge>
                    )}
                    {episode.sources.some(s => s.audio === 'dub') && (
                      <Badge variant="secondary" className="text-xs">DUB</Badge>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
