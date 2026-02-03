import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  LogOut, 
  Clock, 
  Star, 
  Heart, 
  PlayCircle,
  CheckCircle,
  PauseCircle,
  XCircle,
  ListPlus,
  BarChart3,
  Film,
  Users,
  ExternalLink,
  Calendar,
  TrendingUp,
  Award,
  Tv,
  Building2,
  Sparkles,
  Target,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAnimeList, useUserFavorites } from '@/hooks/useAniListUser';
import { useUserProfile, useUserFollowers, useUserFollowing, useUserActivity } from '@/hooks/useUserProfile';
import { AnimeCard, AnimeCardSkeleton } from '@/components/anime';
import { FollowersModal } from '@/components/social';
import { MarkdownRenderer } from '@/components/ui/markdown';
import { ScoreDistributionChart, GenreDistributionChart, FormatDistributionChart, StatusDistributionChart } from '@/components/stats/StatsCharts';
import { SEO } from '@/components/seo';

const Profile = () => {
  const { user, isLoading: isAuthLoading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);
  const [activeTab, setActiveTab] = useState('watching');
  
  // Consolidated profile fetch - includes stats, favorites, social counts
  const { data: profileData } = useUserProfile(user?.id, undefined);
  const profile = profileData?.user;
  const followerCount = profileData?.followerCount || 0;
  const followingCount = profileData?.followingCount || 0;
  
  // User's own anime list from authenticated endpoint
  const { data: animeList, isLoading: isListLoading } = useUserAnimeList();
  const { data: favorites, isLoading: isFavoritesLoading } = useUserFavorites();
  
  // Lazy load followers/following only when modal is opened
  const { data: followers } = useUserFollowers(user?.id || 0, 1, modalType === 'followers');
  const { data: following } = useUserFollowing(user?.id || 0, 1, modalType === 'following');
  
  // Activity is included in consolidated query when tab is active

  // Calculate derived stats
  const derivedStats = useMemo(() => {
    const stats = profile?.statistics?.anime;
    if (!stats) return null;

    const totalMinutes = stats.minutesWatched || 0;
    const totalDays = totalMinutes / 60 / 24;
    const totalHours = totalMinutes / 60;
    const avgEpisodesPerAnime = stats.count ? (stats.episodesWatched || 0) / stats.count : 0;
    
    // Top genres
    const topGenres = [...(stats.genres || [])].sort((a, b) => b.count - a.count).slice(0, 5);
    
    // Top studios
    const topStudios = [...(stats.studios || [])].sort((a, b) => b.count - a.count).slice(0, 5);
    
    // Format breakdown
    const formats = stats.formats || [];
    const totalFormatCount = formats.reduce((sum, f) => sum + f.count, 0);
    
    // Status breakdown  
    const statuses = stats.statuses || [];
    const watching = statuses.find(s => s.status === 'CURRENT')?.count || 0;
    const completed = statuses.find(s => s.status === 'COMPLETED')?.count || 0;
    const planning = statuses.find(s => s.status === 'PLANNING')?.count || 0;
    const dropped = statuses.find(s => s.status === 'DROPPED')?.count || 0;
    const paused = statuses.find(s => s.status === 'PAUSED')?.count || 0;
    
    // Score analysis
    const scores = stats.scores || [];
    const scoredCount = scores.reduce((sum, s) => sum + s.count, 0);
    const scoreSum = scores.reduce((sum, s) => sum + (s.score * s.count), 0);
    const avgScore = scoredCount > 0 ? scoreSum / scoredCount : 0;
    const highScores = scores.filter(s => s.score >= 8).reduce((sum, s) => sum + s.count, 0);
    const lowScores = scores.filter(s => s.score <= 4).reduce((sum, s) => sum + s.count, 0);

    return {
      totalDays: totalDays.toFixed(1),
      totalHours: Math.round(totalHours),
      avgEpisodesPerAnime: avgEpisodesPerAnime.toFixed(1),
      topGenres,
      topStudios,
      formats,
      totalFormatCount,
      watching,
      completed,
      planning,
      dropped,
      paused,
      scoredCount,
      avgScore: avgScore.toFixed(2),
      highScores,
      lowScores,
      completionRate: stats.count ? ((completed / stats.count) * 100).toFixed(1) : '0',
      dropRate: stats.count ? ((dropped / stats.count) * 100).toFixed(1) : '0',
    };
  }, [profile?.statistics?.anime]);

  // Redirect if not authenticated
  if (!isAuthLoading && !isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (isAuthLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  const stats = user.statistics?.anime || profile?.statistics?.anime;
  const daysWatched = stats?.minutesWatched ? Math.round(stats.minutesWatched / 60 / 24) : 0;

  return (
    <>
      <SEO 
        title={`${user.name}'s Profile`}
        description={`${user.name}'s anime profile. ${stats?.count || 0} anime watched, ${stats?.episodesWatched || 0} episodes completed.`}
        image={user.avatar?.large}
        type="profile"
      />
      <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-48 md:h-64">
        {user.bannerImage || profile?.bannerImage ? (
          <img
            src={user.bannerImage || profile?.bannerImage}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-8">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={user.avatar?.large}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-background shadow-lg object-cover"
          />
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
              {profile?.donatorBadge && (
                <Badge variant="secondary" className="text-xs">
                  {profile.donatorBadge}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground justify-center sm:justify-start">
              <button 
                onClick={() => setModalType('followers')}
                className="hover:text-foreground transition-colors"
              >
                <span className="font-medium text-foreground">{followerCount}</span> Followers
              </button>
              <button 
                onClick={() => setModalType('following')}
                className="hover:text-foreground transition-colors"
              >
                <span className="font-medium text-foreground">{followingCount}</span> Following
              </button>
            </div>

            {profile?.createdAt && (
              <p className="text-xs text-muted-foreground mt-1">
                <Calendar className="w-3 h-3 inline mr-1" />
                Joined {formatDistanceToNow(profile.createdAt * 1000)} ago
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={user.siteUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                AniList
              </a>
            </Button>
            <Button variant="destructive" onClick={logout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats Summary */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
            <QuickStatCard
              icon={Film}
              value={stats.count?.toLocaleString() || 0}
              label="Total Anime"
              color="text-primary"
              bgColor="bg-primary/10"
            />
            <QuickStatCard
              icon={PlayCircle}
              value={stats.episodesWatched?.toLocaleString() || 0}
              label="Episodes"
              color="text-blue-500"
              bgColor="bg-blue-500/10"
            />
            <QuickStatCard
              icon={Clock}
              value={daysWatched}
              label="Days Watched"
              color="text-purple-500"
              bgColor="bg-purple-500/10"
            />
            <QuickStatCard
              icon={Star}
              value={stats.meanScore?.toFixed(1) || '-'}
              label="Mean Score"
              color="text-yellow-500"
              bgColor="bg-yellow-500/10"
            />
            <QuickStatCard
              icon={BarChart3}
              value={stats.standardDeviation?.toFixed(1) || '-'}
              label="Std Dev"
              color="text-green-500"
              bgColor="bg-green-500/10"
            />
            <QuickStatCard
              icon={Target}
              value={`${derivedStats?.completionRate || 0}%`}
              label="Completion"
              color="text-emerald-500"
              bgColor="bg-emerald-500/10"
            />
          </div>
        )}

        {/* Detailed Summary Card */}
        {derivedStats && (
          <Card className="mb-8 bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Anime Journey Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Time Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-primary">{derivedStats.totalDays}</p>
                  <p className="text-sm text-muted-foreground">Days of Anime</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-blue-500">{derivedStats.totalHours.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-purple-500">{derivedStats.avgEpisodesPerAnime}</p>
                  <p className="text-sm text-muted-foreground">Avg Episodes/Anime</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-yellow-500">{derivedStats.avgScore}</p>
                  <p className="text-sm text-muted-foreground">Avg Score Given</p>
                </div>
              </div>

              {/* Status Breakdown */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <ListPlus className="w-4 h-4" /> List Status Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <StatusBadge icon={PlayCircle} label="Watching" count={derivedStats.watching} color="text-blue-500" />
                  <StatusBadge icon={CheckCircle} label="Completed" count={derivedStats.completed} color="text-green-500" />
                  <StatusBadge icon={ListPlus} label="Planning" count={derivedStats.planning} color="text-gray-400" />
                  <StatusBadge icon={PauseCircle} label="Paused" count={derivedStats.paused} color="text-yellow-500" />
                  <StatusBadge icon={XCircle} label="Dropped" count={derivedStats.dropped} color="text-red-500" />
                </div>
              </div>

              {/* Scoring Analysis */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Scoring Analysis
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-lg font-bold text-green-500">{derivedStats.highScores}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">High Scores (8+)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-yellow-500" />
                      <span className="text-lg font-bold text-yellow-500">{derivedStats.scoredCount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Total Scored</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-lg font-bold text-red-500">{derivedStats.lowScores}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Low Scores (≤4)</p>
                  </div>
                </div>
              </div>

              {/* Top Genres */}
              {derivedStats.topGenres.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Top Genres
                  </h4>
                  <div className="space-y-2">
                    {derivedStats.topGenres.map((genre, i) => (
                      <div key={genre.genre} className="flex items-center gap-3">
                        <span className="w-6 text-sm font-medium text-muted-foreground">#{i + 1}</span>
                        <span className="flex-1 font-medium">{genre.genre}</span>
                        <span className="text-sm text-muted-foreground">{genre.count} anime</span>
                        <Badge variant="secondary" className="text-xs">
                          {genre.meanScore?.toFixed(1) || '-'} avg
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Studios */}
              {derivedStats.topStudios.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Top Studios
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {derivedStats.topStudios.map((studio) => (
                      <Badge key={studio.studio.id} variant="outline" className="py-1.5 px-3">
                        {studio.studio.name}
                        <span className="ml-2 text-muted-foreground">({studio.count})</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Format Breakdown */}
              {derivedStats.formats.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Tv className="w-4 h-4" /> Format Breakdown
                  </h4>
                  <div className="space-y-2">
                    {derivedStats.formats.map((format) => {
                      const percentage = derivedStats.totalFormatCount > 0 
                        ? (format.count / derivedStats.totalFormatCount) * 100 
                        : 0;
                      return (
                        <div key={format.format} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{format.format?.replace('_', ' ') || 'Unknown'}</span>
                            <span className="text-muted-foreground">{format.count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* About */}
        {user.about && (
          <Card className="mb-8 bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownRenderer content={user.about} />
            </CardContent>
          </Card>
        )}

        {/* Lists */}
        <Tabs defaultValue="watching" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="watching" className="gap-2">
              <PlayCircle className="w-4 h-4" />
              Watching
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="planning" className="gap-2">
              <ListPlus className="w-4 h-4" />
              Planning
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="w-4 h-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Clock className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Watching */}
          <TabsContent value="watching">
            <ListContent 
              entries={animeList?.lists?.find(l => l.status === 'CURRENT')?.entries}
              isLoading={isListLoading}
              emptyMessage="You're not watching any anime right now"
            />
          </TabsContent>

          {/* Completed */}
          <TabsContent value="completed">
            <ListContent 
              entries={animeList?.lists?.find(l => l.status === 'COMPLETED')?.entries}
              isLoading={isListLoading}
              emptyMessage="You haven't completed any anime yet"
            />
          </TabsContent>

          {/* Planning */}
          <TabsContent value="planning">
            <ListContent 
              entries={animeList?.lists?.find(l => l.status === 'PLANNING')?.entries}
              isLoading={isListLoading}
              emptyMessage="Your plan to watch list is empty"
            />
          </TabsContent>

          {/* Favorites */}
          <TabsContent value="favorites">
            {isFavoritesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            ) : favorites?.nodes && favorites.nodes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favorites.nodes.map((anime: any, index: number) => (
                  <AnimeCard key={anime.id} anime={anime} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState message="You haven't favorited any anime yet" />
            )}
          </TabsContent>

          {/* Stats Tab - Charts */}
          <TabsContent value="stats" className="space-y-8">
            {/* Score Distribution */}
            {profile?.statistics?.anime?.scores && profile.statistics.anime.scores.length > 0 && (
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScoreDistributionChart data={profile.statistics.anime.scores} />
                </CardContent>
              </Card>
            )}

            {/* Status Distribution */}
            {profile?.statistics?.anime?.statuses && profile.statistics.anime.statuses.length > 0 && (
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusDistributionChart data={profile.statistics.anime.statuses} />
                </CardContent>
              </Card>
            )}

            {/* Genre Distribution */}
            {profile?.statistics?.anime?.genres && profile.statistics.anime.genres.length > 0 && (
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Top Genres</CardTitle>
                </CardHeader>
                <CardContent>
                  <GenreDistributionChart data={profile.statistics.anime.genres} />
                </CardContent>
              </Card>
            )}

            {/* Format Distribution */}
            {profile?.statistics?.anime?.formats && profile.statistics.anime.formats.length > 0 && (
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Format Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormatDistributionChart data={profile.statistics.anime.formats} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            {profileData?.activities && profileData.activities.length > 0 ? (
              <div className="space-y-3">
                {profileData.activities.map((act) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 bg-card/50 backdrop-blur border border-border/50 rounded-lg p-3"
                  >
                    {act.media?.coverImage?.medium && (
                      <Link to={`/anime/${act.media.id}`} className="shrink-0">
                        <img
                          src={act.media.coverImage.medium}
                          alt=""
                          className="w-12 h-16 object-cover rounded"
                        />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="capitalize">{act.status?.toLowerCase()}</span>
                        {act.progress && ` ${act.progress}`}
                        {' '}
                        <Link 
                          to={`/anime/${act.media?.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {act.media?.title?.english || act.media?.title?.romaji}
                        </Link>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(act.createdAt * 1000)} ago
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No recent activity
              </p>
            )}
          </TabsContent>
        </Tabs>

        {/* Followers/Following Modal */}
        {user?.id && (
          <FollowersModal
            userId={user.id}
            type={modalType || 'followers'}
            isOpen={!!modalType}
            onClose={() => setModalType(null)}
          />
        )}
      </div>
    </div>
    </>
  );
};

function QuickStatCard({ 
  icon: Icon, 
  value, 
  label, 
  color,
  bgColor 
}: { 
  icon: typeof Clock; 
  value: string | number; 
  label: string; 
  color: string;
  bgColor: string;
}) {
  return (
    <div className={`${bgColor} border border-border/50 p-4 rounded-xl text-center transition-transform hover:scale-105`}>
      <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function StatusBadge({ 
  icon: Icon, 
  label, 
  count, 
  color 
}: { 
  icon: typeof PlayCircle; 
  label: string; 
  count: number; 
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm font-medium">{count}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function ListContent({ 
  entries, 
  isLoading, 
  emptyMessage 
}: { 
  entries: any[] | undefined; 
  isLoading: boolean;
  emptyMessage: string;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <AnimeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{entries.length} entries</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {entries.map((entry: any, index: number) => (
          <div key={entry.id} className="relative">
            {entry.media && <AnimeCard anime={entry.media} index={index} />}
            {entry.progress !== undefined && entry.media?.episodes && (
              <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm px-2 py-1 text-xs text-center">
                Progress: {entry.progress}/{entry.media.episodes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">{message}</p>
      <Button asChild className="mt-4">
        <Link to="/browse">Browse Anime</Link>
      </Button>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen">
      <Skeleton className="h-48 md:h-64 w-full" />
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-8">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </div>
  );
}

export default Profile;
