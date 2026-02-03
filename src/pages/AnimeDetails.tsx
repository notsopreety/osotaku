import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Heart, 
  Plus, 
  Star, 
  Calendar, 
  Clock, 
  Tv, 
  Film,
  ExternalLink,
  Check,
  BookOpen,
  Info,
  TrendingUp,
  Users,
  Award,
  Hash,
  Globe,
  BarChart3,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAnimeDetails } from '@/hooks/useAnime';
import { useSaveMediaListEntry, useToggleFavorite, useUserAnimeList, useDeleteMediaListEntry, useUserFavoriteStatus } from '@/hooks/useAniListUser';
import { useAuth } from '@/contexts/AuthContext';
import { AnimeCard } from '@/components/anime';
import { ListEntryEditor, type ListEntryData, EpisodeTabContent } from '@/components/anime';
import { useEpisodes } from '@/hooks/useEpisodes';
import { cn, formatAiringTime, formatAiringDate } from '@/lib/utils';
import { toast } from 'sonner';
import { SEO, JsonLd, generateAnimeJsonLd } from '@/components/seo';
import type { MediaListStatus } from '@/types/anime';

const ANIME_FORMATS = ['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL', 'TV_SHORT', 'MUSIC'];

const STATUS_LABELS: Record<string, string> = {
  CURRENT: 'Watching',
  PLANNING: 'Planning',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
  PAUSED: 'Paused',
  REPEATING: 'Rewatching',
};

const AnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: anime, isLoading, error } = useAnimeDetails(id ? parseInt(id) : undefined);
  const { isAuthenticated } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const { mutate: saveEntry, isPending: isSaving } = useSaveMediaListEntry();
  const { mutate: deleteEntry, isPending: isDeleting } = useDeleteMediaListEntry();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useToggleFavorite();
  const { data: userLists } = useUserAnimeList();
  const isFavorite = useUserFavoriteStatus(anime?.id || 0);
  const { data: episodeData } = useEpisodes(anime?.id);
  
  const episodes = episodeData?.episodes || [];
  const firstEpisode = episodes[0];

  // Find current status in user's list
  const currentEntry = userLists?.lists?.flatMap(list => list.entries || []).find(
    entry => entry.mediaId === anime?.id
  );
  const currentStatus = currentEntry?.status;

  const handleAddToList = (status: MediaListStatus) => {
    if (!isAuthenticated) {
      toast.error('Login Required', {
        description: 'Please login with AniList to manage your list.',
      });
      navigate('/login');
      return;
    }

    if (!anime) return;

    saveEntry(
      { mediaId: anime.id, status },
      {
        onSuccess: () => {
          toast.success('Added to List', {
            description: `${anime.title?.english || anime.title?.romaji} added to ${STATUS_LABELS[status]}`,
          });
        },
        onError: (error) => {
          console.error('Save entry error:', error);
          toast.error('Error', {
            description: 'Failed to update list. Please try again.',
          });
        },
      }
    );
  };

  const handleSaveEntry = (data: ListEntryData) => {
    saveEntry(data, {
      onSuccess: () => {
        toast.success('List Updated', {
          description: `${anime?.title?.english || anime?.title?.romaji} updated successfully.`,
        });
        setIsEditorOpen(false);
      },
      onError: (error) => {
        console.error('Save entry error:', error);
        toast.error('Error', {
          description: 'Failed to update list. Please try again.',
        });
      },
    });
  };

  const handleDeleteEntry = () => {
    if (!currentEntry?.id) return;
    
    deleteEntry(currentEntry.id, {
      onSuccess: () => {
        toast.success('Removed from List', {
          description: `${anime?.title?.english || anime?.title?.romaji} removed from your list.`,
        });
        setIsEditorOpen(false);
      },
      onError: () => {
        toast.error('Error', {
          description: 'Failed to remove from list. Please try again.',
        });
      },
    });
  };

  const handleOpenEditor = () => {
    if (!isAuthenticated) {
      toast.error('Login Required', {
        description: 'Please login with AniList to manage your list.',
      });
      navigate('/login');
      return;
    }
    setIsEditorOpen(true);
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Login Required', {
        description: 'Please login with AniList to add favorites.',
      });
      navigate('/login');
      return;
    }

    if (!anime) return;

    toggleFavorite(anime.id, {
      onSuccess: () => {
        toast.success('Favorites Updated', {
          description: `${anime.title?.english || anime.title?.romaji} favorites toggled.`,
        });
      },
      onError: () => {
        toast.error('Error', {
          description: 'Failed to update favorites. Please try again.',
        });
      },
    });
  };

  if (isLoading) {
    return <AnimeDetailsSkeleton />;
  }

  if (error || !anime) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Anime not found</h1>
        <p className="text-muted-foreground mb-6">The anime you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const title = anime.title?.english || anime.title?.romaji || 'Unknown';
  const nativeTitle = anime.title?.native;
  const mainStudio = anime.studios?.edges?.find(e => e.isMain)?.node;
  const formatIcons: Record<string, typeof Tv> = { TV: Tv, MOVIE: Film, TV_SHORT: Tv, OVA: Tv, ONA: Tv };
  const FormatIcon = formatIcons[anime.format || 'TV'] || Tv;
  const cleanDescription = anime.description?.replace(/<[^>]*>/g, '').slice(0, 160) || '';

  return (
    <>
      <SEO 
        title={title}
        description={cleanDescription}
        image={anime.bannerImage || anime.coverImage?.extraLarge}
        type="article"
        keywords={[...(anime.genres || []), 'anime', title]}
      />
      <JsonLd data={generateAnimeJsonLd({
        title,
        description: cleanDescription,
        image: anime.coverImage?.extraLarge,
        rating: anime.averageScore ? anime.averageScore / 10 : undefined,
        datePublished: anime.startDate?.year ? `${anime.startDate.year}-${anime.startDate.month || 1}-${anime.startDate.day || 1}` : undefined,
        genre: anime.genres,
      })} />
      <div className="min-h-screen">
      {/* Banner Section */}
      <div className="relative h-[400px] md:h-[500px]">
        {anime.bannerImage ? (
          <img
            src={anime.bannerImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: anime.coverImage?.color || 'hsl(var(--muted))' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover Image */}
          <div className="shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-48 md:w-56 mx-auto md:mx-0"
            >
              <img
                src={anime.coverImage?.extraLarge || anime.coverImage?.large}
                alt={title}
                className="w-full rounded-lg shadow-2xl"
              />
              
              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {/* Watch Now - only show if episodes exist */}
                {firstEpisode && (
                  <Button className="w-full gap-2" size="lg" asChild>
                    <Link to={`/watch/${anime.id}/${firstEpisode.epId}`}>
                      <Play className="w-5 h-5 fill-current" />
                      Watch Now
                    </Link>
                  </Button>
                )}
                
                {/* Add/Edit Episodes - always visible */}
                <Button 
                  className="w-full gap-2" 
                  size="lg" 
                  variant={firstEpisode ? "outline" : "secondary"} 
                  asChild
                >
                  <a 
                    href={episodes.length > 0 
                      ? `https://github.com/notsopreety/osotaku/tree/main/public/data/${anime.id}.json`
                      : 'https://github.com/notsopreety/osotaku/tree/main/public/data'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Plus className="w-5 h-5" />
                    {episodes.length > 0 
                      ? (episodes.length >= (anime.episodes || 0) && anime.episodes 
                        ? (anime.format === 'MOVIE' ? 'Edit Source' : 'Edit Episodes')
                        : 'Add More')
                      : (anime.format === 'MOVIE' ? 'Add Source' : 'Add Episodes')
                    }
                  </a>
                </Button>
                <div className="flex gap-2">
                  {/* Add to List / Edit Button */}
                  {currentEntry ? (
                    <Button 
                      variant="secondary" 
                      className="flex-1 gap-2" 
                      onClick={handleOpenEditor}
                    >
                      <Edit className="w-4 h-4" />
                      {STATUS_LABELS[currentStatus || 'CURRENT']}
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" className="flex-1 gap-2" disabled={isSaving}>
                          <Plus className="w-4 h-4" />
                          Add to List
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        {Object.entries(STATUS_LABELS).map(([status, label]) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleAddToList(status as MediaListStatus)}
                          >
                            {label}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleOpenEditor}>
                          <Edit className="w-4 h-4 mr-2" />
                          Advanced Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  
                  <Button 
                    variant={isFavorite ? 'default' : 'secondary'}
                    size="icon"
                    onClick={handleToggleFavorite}
                    disabled={isTogglingFavorite}
                  >
                    <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
              {nativeTitle && (
                <p className="text-lg text-muted-foreground mb-4">{nativeTitle}</p>
              )}

              {/* Next Episode Airing Info */}
              {anime.nextAiringEpisode && anime.status === 'RELEASING' && (
                <div className="mb-4 p-4 bg-secondary/20 border border-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2 text-secondary-foreground">
                    <Info className="w-5 h-5 text-secondary" />
                    <span className="font-medium">
                      Episode {anime.nextAiringEpisode.episode} airs in {formatAiringTime(anime.nextAiringEpisode.timeUntilAiring)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 ml-7">
                    {formatAiringDate(anime.nextAiringEpisode.airingAt)}
                  </p>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {anime.averageScore && (
                  <Badge className="gap-1 bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 fill-current" />
                    {(anime.averageScore / 10).toFixed(1)}
                  </Badge>
                )}
                {anime.format && (
                  <Badge variant="secondary" className="gap-1">
                    <FormatIcon className="w-3 h-3" />
                    {anime.format.replace('_', ' ')}
                  </Badge>
                )}
                {anime.status && (
                  <Badge variant={anime.status === 'RELEASING' ? 'default' : 'outline'}>
                    {anime.status.replace('_', ' ')}
                  </Badge>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres?.map((genre) => (
                  <Link key={genre} to={`/browse?genres=${genre}`}>
                    <Badge variant="outline" className="hover:bg-muted cursor-pointer">
                      {genre}
                    </Badge>
                  </Link>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {anime.episodes && (
                  <div className="bg-card p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Episodes</p>
                    <p className="text-lg font-semibold">{anime.episodes}</p>
                  </div>
                )}
                {anime.duration && (
                  <div className="bg-card p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-lg font-semibold">{anime.duration} min</p>
                  </div>
                )}
                {anime.seasonYear && (
                  <div className="bg-card p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Year</p>
                    <p className="text-lg font-semibold">{anime.season} {anime.seasonYear}</p>
                  </div>
                )}
                {mainStudio && (
                  <div className="bg-card p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Studio</p>
                    <p className="text-lg font-semibold truncate">{mainStudio.name}</p>
                  </div>
                )}
              </div>

              {/* Extended Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {anime.favourites != null && (
                  <div className="bg-card p-3 rounded-lg flex items-center gap-2">
                    <Heart className="w-4 h-4 text-destructive" />
                    <div>
                      <p className="text-xs text-muted-foreground">Favorites</p>
                      <p className="text-lg font-semibold">{anime.favourites.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {anime.popularity != null && (
                  <div className="bg-card p-3 rounded-lg flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Popularity</p>
                      <p className="text-lg font-semibold">#{anime.popularity.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {anime.meanScore != null && (
                  <div className="bg-card p-3 rounded-lg flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-secondary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mean Score</p>
                      <p className="text-lg font-semibold">{anime.meanScore}%</p>
                    </div>
                  </div>
                )}
                {anime.trending != null && anime.trending > 0 && (
                  <div className="bg-card p-3 rounded-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Trending</p>
                      <p className="text-lg font-semibold">#{anime.trending}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Rankings */}
              {anime.rankings && anime.rankings.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5" /> Rankings
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {anime.rankings.slice(0, 6).map((ranking) => (
                      <Badge 
                        key={ranking.id} 
                        variant={ranking.type === 'RATED' ? 'default' : 'secondary'}
                        className="py-1.5 px-3"
                      >
                        <span className="font-bold mr-1">#{ranking.rank}</span>
                        {ranking.context}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {anime.source && (
                  <div className="bg-card p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Source
                    </p>
                    <p className="font-medium capitalize">{anime.source.replace(/_/g, ' ').toLowerCase()}</p>
                  </div>
                )}
                {anime.countryOfOrigin && (
                  <div className="bg-card p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Origin
                    </p>
                    <p className="font-medium">{anime.countryOfOrigin}</p>
                  </div>
                )}
                {anime.hashtag && (
                  <div className="bg-card p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3 h-3" /> Hashtag
                    </p>
                    <p className="font-medium text-sm truncate">{anime.hashtag}</p>
                  </div>
                )}
                {anime.startDate?.year && (
                  <div className="bg-card p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Start Date
                    </p>
                    <p className="font-medium">
                      {anime.startDate.month}/{anime.startDate.day}/{anime.startDate.year}
                    </p>
                  </div>
                )}
                {anime.endDate?.year && (
                  <div className="bg-card p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> End Date
                    </p>
                    <p className="font-medium">
                      {anime.endDate.month}/{anime.endDate.day}/{anime.endDate.year}
                    </p>
                  </div>
                )}
              </div>

              {/* Synonyms */}
              {anime.synonyms && anime.synonyms.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Alternative Titles</h2>
                  <div className="flex flex-wrap gap-2">
                    {anime.synonyms.slice(0, 5).map((synonym, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {synonym}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Synopsis */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {anime.description?.replace(/<[^>]*>/g, '') || 'No description available.'}
                </p>
              </div>

              {/* Tags - Now Clickable */}
              {anime.tags && anime.tags.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {anime.tags
                      .filter((tag) => !tag.isMediaSpoiler)
                      .map((tag) => (
                        <Link key={tag.id} to={`/browse?tags=${encodeURIComponent(tag.name)}`}>
                          <Badge 
                            variant="outline" 
                            className="text-xs py-1 hover:bg-muted cursor-pointer transition-colors"
                          >
                            {tag.name}
                            <span className="ml-1 text-muted-foreground">{tag.rank}%</span>
                          </Badge>
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* External Links - Streaming */}
              {anime.externalLinks && anime.externalLinks.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Watch On</h2>
                  <div className="flex flex-wrap gap-2">
                    {anime.externalLinks
                      .filter((link: any) => link.type === 'STREAMING')
                      .map((link: any) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card hover:bg-accent text-sm transition-colors"
                          style={link.color ? { borderLeft: `3px solid ${link.color}` } : undefined}
                        >
                          {link.icon && (
                            <img src={link.icon} alt="" className="w-4 h-4" />
                          )}
                          {link.site}
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </a>
                      ))}
                    {anime.externalLinks.filter((l: any) => l.type === 'STREAMING').length === 0 && (
                      <p className="text-sm text-muted-foreground">No streaming links available</p>
                    )}
                  </div>
                </div>
              )}

              {/* Info Links */}
              {anime.externalLinks && anime.externalLinks.filter((l: any) => l.type === 'INFO').length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">External Links</h2>
                  <div className="flex flex-wrap gap-2">
                    {anime.externalLinks
                      .filter((link: any) => link.type === 'INFO')
                      .slice(0, 8)
                      .map((link: any) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card hover:bg-accent text-sm transition-colors"
                        >
                          {link.icon && (
                            <img src={link.icon} alt="" className="w-4 h-4" />
                          )}
                          {link.site}
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="episodes" className="mt-12">
          <TabsList className="mb-6">
            <TabsTrigger value="episodes">
              {anime.format === 'MOVIE' ? 'Movie' : 'Episodes'}
            </TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="relations">Relations</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* Episodes Tab */}
          <TabsContent value="episodes">
            <EpisodeTabContent 
              anilistId={anime.id}
              totalEpisodes={anime.episodes || 0}
              isMovie={anime.format === 'MOVIE'}
            />
          </TabsContent>

          {/* Characters Tab */}
          <TabsContent value="characters">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {anime.characters?.edges?.slice(0, 12).map((edge) => (
                <div
                  key={edge.node?.id}
                  className="flex gap-3 bg-card rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={edge.node?.image?.medium || edge.node?.image?.large}
                    alt={edge.node?.name?.full}
                    className="w-14 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{edge.node?.name?.full}</p>
                    <p className="text-xs text-muted-foreground capitalize">{edge.role?.toLowerCase()}</p>
                    {edge.voiceActors?.[0] && (
                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={edge.voiceActors[0].image?.medium}
                          alt={edge.voiceActors[0].name?.full}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <p className="text-xs text-muted-foreground truncate">
                          {edge.voiceActors[0].name?.full}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {anime.staff?.edges?.slice(0, 12).map((edge) => (
                <div
                  key={edge.node?.id}
                  className="flex gap-3 bg-card rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={edge.node?.image?.medium || edge.node?.image?.large}
                    alt={edge.node?.name?.full}
                    className="w-14 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{edge.node?.name?.full}</p>
                    <p className="text-xs text-muted-foreground">{edge.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Relations Tab */}
          <TabsContent value="relations">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {anime.relations?.edges?.map((edge) => {
                const format = edge.node?.format || '';
                const isAnimeFormat = ANIME_FORMATS.includes(format);
                const relationTitle = edge.node?.title?.english || edge.node?.title?.romaji;

                const content = (
                  <>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 relative">
                      <img
                        src={edge.node?.coverImage?.large || edge.node?.coverImage?.medium}
                        alt={relationTitle}
                        className={cn(
                          "w-full h-full object-cover transition-transform",
                          isAnimeFormat && "group-hover:scale-105"
                        )}
                      />
                      {/* Format Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs gap-1">
                          {format === 'MANGA' && <BookOpen className="w-3 h-3" />}
                          {format === 'MOVIE' && <Film className="w-3 h-3" />}
                          {(format === 'TV' || format === 'OVA' || format === 'ONA') && <Tv className="w-3 h-3" />}
                          {format?.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-primary font-medium uppercase">
                      {edge.relationType?.replace('_', ' ')}
                    </p>
                    <p className="text-sm font-medium truncate">
                      {relationTitle}
                    </p>
                  </>
                );

                if (isAnimeFormat) {
                  return (
                    <Link
                      key={edge.node?.id}
                      to={`/anime/${edge.node?.id}`}
                      className="group"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <div
                    key={edge.node?.id}
                    className="opacity-70 cursor-not-allowed"
                    title={`${format} - Not viewable on this site`}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {anime.recommendations?.nodes?.map((rec) => (
                rec.mediaRecommendation && (
                  <AnimeCard key={rec.id} anime={rec.mediaRecommendation} />
                )
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* External Links */}
        {anime.externalLinks && anime.externalLinks.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-xl font-semibold mb-4">External Links</h2>
            <div className="flex flex-wrap gap-2">
              {anime.externalLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted rounded-lg transition-colors text-sm"
                  style={{ borderColor: link.color || undefined }}
                >
                  {link.icon && (
                    <img src={link.icon} alt="" className="w-4 h-4" />
                  )}
                  {link.site}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Trailer */}
        {anime.trailer?.site === 'youtube' && anime.trailer.id && (
          <div className="mt-12 mb-8">
            <h2 className="text-xl font-semibold mb-4">Trailer</h2>
            <div className="aspect-video max-w-3xl rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                title="Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>

      {/* List Entry Editor Modal */}
      <ListEntryEditor
        anime={anime}
        entry={currentEntry}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveEntry}
        onDelete={currentEntry ? handleDeleteEntry : undefined}
        isSaving={isSaving}
        isDeleting={isDeleting}
      />
    </div>
    </>
  );
};

function AnimeDetailsSkeleton() {
  return (
    <div className="min-h-screen">
      <Skeleton className="h-[400px] md:h-[500px] w-full" />
      <div className="container mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            <Skeleton className="w-48 md:w-56 h-72 md:h-80 mx-auto md:mx-0 rounded-lg" />
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeDetails;
