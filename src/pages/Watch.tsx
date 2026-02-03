import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Plus,
  Film
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoPlayer, EpisodeList, ServerSelector } from '@/components/player';
import { useEpisode } from '@/hooks/useEpisodes';
import { useAnimeDetails } from '@/hooks/useAnime';
import { SEO } from '@/components/seo';
import type { EpisodeSource } from '@/types/episode';

const GITHUB_DATA_URL = 'https://github.com/notsopreety/osotaku/tree/main/public/data';

export default function Watch() {
  const { anilistId, epId } = useParams<{ anilistId: string; epId: string }>();
  const navigate = useNavigate();
  
  const numericId = anilistId ? parseInt(anilistId) : undefined;
  const { data: anime, isLoading: animeLoading } = useAnimeDetails(numericId);
  const { 
    episode, 
    episodes, 
    prevEpisode, 
    nextEpisode, 
    currentIndex,
    isLoading: episodesLoading 
  } = useEpisode(numericId, epId);

  const [preferredAudio, setPreferredAudio] = useState<'sub' | 'dub'>(() => {
    return (localStorage.getItem('preferredAudio') as 'sub' | 'dub') || 'sub';
  });
  const [selectedSource, setSelectedSource] = useState<EpisodeSource | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>('auto');

  const isMovie = anime?.format === 'MOVIE';
  const title = anime?.title?.english || anime?.title?.romaji || 'Unknown';
  const epNumber = epId?.replace('ep-', '');

  // Select best source based on preference
  useEffect(() => {
    if (!episode) return;
    
    const sources = episode.sources;
    const preferredSources = sources.filter(s => s.audio === preferredAudio);
    const hlsSources = preferredSources.filter(s => s.type === 'hls');
    
    // Prefer HLS over embed, then filter by audio preference
    const bestSource = hlsSources[0] || preferredSources[0] || sources[0];
    
    if (bestSource) {
      setSelectedSource(bestSource);
      setSelectedQuality(bestSource.data[0].quality);
    }
  }, [episode, preferredAudio]);

  const handleAudioChange = (audio: 'sub' | 'dub') => {
    setPreferredAudio(audio);
    localStorage.setItem('preferredAudio', audio);
  };

  const handleSourceSelect = (source: EpisodeSource, quality: string) => {
    setSelectedSource(source);
    setSelectedQuality(quality);
  };

  const navigateToEpisode = (ep: typeof prevEpisode) => {
    if (ep) {
      navigate(`/watch/${anilistId}/${ep.epId}`);
    }
  };

  // Loading state
  if (animeLoading || episodesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="aspect-video w-full max-w-5xl mx-auto rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Skeleton className="lg:col-span-2 h-32" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  // No episodes available
  if (!episodes || episodes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title={`${title} - No Episodes`} />
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <Link 
            to={`/anime/${anilistId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {title}
          </Link>

          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">No Episodes Available</h1>
            <p className="text-muted-foreground mb-8">
              This anime doesn't have any episodes added yet. Would you like to contribute?
            </p>
            <Button asChild size="lg">
              <a 
                href={`${GITHUB_DATA_URL}/${anilistId}.json`}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Episodes
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Episode not found
  if (!episode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link 
            to={`/anime/${anilistId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {title}
          </Link>

          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Episode Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The requested episode doesn't exist.
            </p>
            <Button asChild>
              <Link to={`/watch/${anilistId}/${episodes[0].epId}`}>
                Watch First Episode
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${title} - ${isMovie ? 'Watch' : `Episode ${epNumber}`}`}
        description={episode.description || `Watch ${title} ${isMovie ? '' : `Episode ${epNumber}`}`}
        image={episode.thumbnail || anime?.bannerImage}
      />

      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            to={`/anime/${anilistId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{title}</span>
          </Link>

          {/* Episode navigation */}
          {!isMovie && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!prevEpisode}
                onClick={() => navigateToEpisode(prevEpisode)}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </Button>
              <Badge variant="secondary" className="font-mono">
                {currentIndex + 1} / {episodes.length}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                disabled={!nextEpisode}
                onClick={() => navigateToEpisode(nextEpisode)}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Add episodes link */}
          <Button variant="ghost" size="sm" asChild>
            <a 
              href={`${GITHUB_DATA_URL}/${anilistId}.json`}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{isMovie ? 'Edit Source' : 'Add More'}</span>
            </a>
          </Button>
        </div>

        {/* Video Player */}
        <div className="max-w-6xl mx-auto">
          {selectedSource && (
            <VideoPlayer
              source={selectedSource}
              selectedQuality={selectedQuality}
              onPrevEpisode={() => navigateToEpisode(prevEpisode)}
              onNextEpisode={() => navigateToEpisode(nextEpisode)}
              hasPrev={!!prevEpisode}
              hasNext={!!nextEpisode}
              title={`${title} - ${isMovie ? '' : `EP${epNumber}:`} ${episode.title || ''}`}
              availableSources={episode.sources}
              onSourceChange={handleSourceSelect}
            />
          )}
        </div>

        {/* Content below player */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left: Episode info & servers */}
          <div className="lg:col-span-2 space-y-4">
            {/* Episode Info */}
            <div className="bg-card rounded-lg p-4">
              <div className="flex items-start gap-4">
                {anime?.coverImage?.large && (
                  <Link to={`/anime/${anilistId}`} className="shrink-0">
                    <img 
                      src={anime.coverImage.large}
                      alt={title}
                      className="w-16 h-24 object-cover rounded"
                    />
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  <Link to={`/anime/${anilistId}`} className="hover:text-primary">
                    <h1 className="text-lg font-semibold line-clamp-1">{title}</h1>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {isMovie ? '' : `Episode ${epNumber}`}
                    {episode.title && ` • ${episode.title}`}
                  </p>
                  {episode.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {episode.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Server Selector */}
            {selectedSource && (
              <ServerSelector
                sources={episode.sources}
                selectedSource={selectedSource}
                selectedQuality={selectedQuality}
                preferredAudio={preferredAudio}
                onSourceSelect={handleSourceSelect}
                onAudioPreferenceChange={handleAudioChange}
              />
            )}
          </div>

          {/* Right: Episode list */}
          <div className="lg:col-span-1">
            <EpisodeList
              episodes={episodes}
              anilistId={numericId!}
              currentEpId={epId}
              isMovie={isMovie}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
