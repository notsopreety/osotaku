import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { EpisodeSource } from '@/types/episode';

interface ServerSelectorProps {
  sources: EpisodeSource[];
  selectedSource: EpisodeSource;
  selectedQuality: string;
  preferredAudio: 'sub' | 'dub';
  onSourceSelect: (source: EpisodeSource, quality: string) => void;
  onAudioPreferenceChange: (audio: 'sub' | 'dub') => void;
}

export function ServerSelector({
  sources,
  selectedSource,
  selectedQuality,
  preferredAudio,
  onSourceSelect,
  onAudioPreferenceChange,
}: ServerSelectorProps) {
  const subSources = sources.filter(s => s.audio === 'sub');
  const dubSources = sources.filter(s => s.audio === 'dub');
  const hasSubDub = subSources.length > 0 && dubSources.length > 0;

  const filteredSources = sources.filter(s => s.audio === preferredAudio);
  const displaySources = filteredSources.length > 0 ? filteredSources : sources;

  return (
    <div className="bg-card rounded-lg p-4 space-y-4">
      {/* Audio Toggle */}
      {hasSubDub && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Audio:</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={preferredAudio === 'sub' ? 'default' : 'outline'}
              onClick={() => onAudioPreferenceChange('sub')}
              className="h-7 text-xs"
            >
              SUB
            </Button>
            <Button
              size="sm"
              variant={preferredAudio === 'dub' ? 'default' : 'outline'}
              onClick={() => onAudioPreferenceChange('dub')}
              className="h-7 text-xs"
            >
              DUB
            </Button>
          </div>
        </div>
      )}

      {/* Server Selection */}
      <div>
        <span className="text-sm text-muted-foreground mb-2 block">Servers:</span>
        <div className="flex flex-wrap gap-2">
          {displaySources.map((source, idx) => {
            const isSelected = source.server === selectedSource.server && source.audio === selectedSource.audio;
            
            return (
              <div key={`${source.server}-${source.audio}-${idx}`} className="space-y-1">
                <Button
                  size="sm"
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => onSourceSelect(source, source.data[0].quality)}
                  className={cn(
                    "h-8 gap-1.5",
                    source.type === 'hls' && "border-primary/50"
                  )}
                >
                  {source.server}
                  {source.type === 'hls' && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">HLS</Badge>
                  )}
                </Button>
                
                {/* Quality options for selected source */}
                {isSelected && source.data.length > 1 && (
                  <div className="flex gap-1 flex-wrap">
                    {source.data.map((d) => (
                      <Button
                        key={d.quality}
                        size="sm"
                        variant={d.quality === selectedQuality ? 'secondary' : 'ghost'}
                        onClick={() => onSourceSelect(source, d.quality)}
                        className="h-6 text-xs px-2"
                      >
                        {d.quality}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Server info with profile link */}
      <div className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
        <span className="font-medium">Type:</span> {selectedSource.type.toUpperCase()} • 
        <span className="font-medium ml-1">Added by:</span>
        <Link 
          to={`/user/${selectedSource.addedBy}`}
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <User className="w-3 h-3" />
          @{selectedSource.addedBy}
        </Link>
      </div>
    </div>
  );
}
