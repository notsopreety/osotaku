import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  ExternalLink, 
  Users, 
  UserPlus, 
  UserCheck,
  Clock,
  Star,
  BarChart3,
  Heart,
  Play,
  Film,
  Calendar,
  ListPlus,
  CheckCircle,
  PauseCircle,
  XCircle,
  PlayCircle,
  Sparkles,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useUserProfile, 
  useUserFollowers, 
  useUserFollowing, 
  useUserActivity, 
  useToggleFollow, 
  useUserAnimeListPublic 
} from '@/hooks/useUserProfile';
import { AnimeCard, AnimeCardSkeleton } from '@/components/anime';
import { FollowersModal } from '@/components/social';
import { MarkdownRenderer } from '@/components/ui/markdown';
import { ScoreDistributionChart, GenreDistributionChart, FormatDistributionChart, StatusDistributionChart } from '@/components/stats/StatsCharts';
import { SEO } from '@/components/seo';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);
  const [animeListStatus, setAnimeListStatus] = useState<string>('CURRENT');
  
  // Support both numeric ID and username
  const isNumericId = userId && /^\d+$/.test(userId);
  const numericUserId = isNumericId ? parseInt(userId) : undefined;
  const username = !isNumericId ? userId : undefined;
  
  // CONSOLIDATED: Single API call for profile + stats + favorites + social counts + activity
  const { data: profileData, isLoading: isProfileLoading, error } = useUserProfile(
    numericUserId, 
    username
  );
  
  // Destructure consolidated data
  const profile = profileData?.user;
  const followerCount = profileData?.followerCount || 0;
  const followingCount = profileData?.followingCount || 0;
  const activities = profileData?.activities || [];
  
  const isOwnProfile = currentUser?.id === profile?.id;
  const profileId = profile?.id;
  
  // LAZY LOAD: Only fetch when modals are opened
  const { data: followers } = useUserFollowers(profileId || 0, 1, modalType === 'followers');
  const { data: following } = useUserFollowing(profileId || 0, 1, modalType === 'following');
  
  // LAZY LOAD: Only fetch anime list when tab is active
  const { data: animeList, isLoading: isAnimeListLoading } = useUserAnimeListPublic(
    profileId || 0, 
    activeTab === 'animelist'
  );
  
  const toggleFollow = useToggleFollow();
  
  // Calculate derived stats
  const derivedStats = useMemo(() => {
    const stats = profile?.statistics?.anime;
    if (!stats) return null;

    const totalMinutes = stats.minutesWatched || 0;
    const totalDays = totalMinutes / 60 / 24;
    const statuses = stats.statuses || [];
    const completed = statuses.find(s => s.status === 'COMPLETED')?.count || 0;
    const completionRate = stats.count ? ((completed / stats.count) * 100).toFixed(1) : '0';

    return {
      totalDays: totalDays.toFixed(1),
      completionRate,
    };
  }, [profile?.statistics?.anime]);
  
  // Redirect to /profile if viewing own profile
  if (isOwnProfile && profile) {
    navigate('/profile', { replace: true });
    return null;
  }
  
  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error('Login Required', {
        description: 'Please log in to follow users',
      });
      navigate('/login');
      return;
    }
    
    if (!profileId) return;
    
    try {
      await toggleFollow.mutateAsync(profileId);
      toast.success(profile?.isFollowing ? 'Unfollowed' : 'Following', {
        description: profile?.isFollowing 
          ? `You unfollowed ${profile?.name}` 
          : `You are now following ${profile?.name}`,
      });
    } catch {
      toast.error('Error', {
        description: 'Failed to update follow status',
      });
    }
  };
  
  if (isProfileLoading) {
    return <ProfileSkeleton />;
  }
  
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-muted-foreground mb-8">This user doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const stats = profile.statistics?.anime;
  const daysWatched = stats?.minutesWatched ? Math.round(stats.minutesWatched / 60 / 24) : 0;

  return (
    <>
      <SEO 
        title={`${profile.name} - User Profile`}
        description={`${profile.name}'s anime profile. ${stats?.count || 0} anime watched, ${stats?.episodesWatched || 0} episodes completed.`}
        image={profile.avatar?.large}
        type="profile"
      />
      <div className="min-h-screen">
        {/* Banner */}
        <div className="relative h-48 md:h-64">
          {profile.bannerImage ? (
            <img
              src={profile.bannerImage}
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
              src={profile.avatar?.large}
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-background shadow-lg object-cover"
            />
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
                {profile.donatorBadge && (
                  <Badge variant="secondary" className="text-xs">
                    {profile.donatorBadge}
                  </Badge>
                )}
                {profile.isFollower && (
                  <Badge variant="outline" className="text-xs">
                    Follows you
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

              {profile.createdAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Joined {formatDistanceToNow(profile.createdAt * 1000)} ago
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {isAuthenticated && !isOwnProfile && (
                <Button
                  variant={profile.isFollowing ? 'secondary' : 'default'}
                  onClick={handleFollow}
                  disabled={toggleFollow.isPending}
                  className="gap-2"
                >
                  {profile.isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </Button>
              )}
              <Button variant="outline" asChild>
                <a href={profile.siteUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  AniList
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
              <QuickStatCard icon={Film} value={stats.count?.toLocaleString() || 0} label="Total Anime" color="text-primary" bgColor="bg-primary/10" />
              <QuickStatCard icon={PlayCircle} value={stats.episodesWatched?.toLocaleString() || 0} label="Episodes" color="text-blue-500" bgColor="bg-blue-500/10" />
              <QuickStatCard icon={Clock} value={daysWatched} label="Days Watched" color="text-purple-500" bgColor="bg-purple-500/10" />
              <QuickStatCard icon={Star} value={stats.meanScore?.toFixed(1) || '-'} label="Mean Score" color="text-yellow-500" bgColor="bg-yellow-500/10" />
              <QuickStatCard icon={BarChart3} value={stats.standardDeviation?.toFixed(1) || '-'} label="Std Dev" color="text-green-500" bgColor="bg-green-500/10" />
              <QuickStatCard icon={Target} value={`${derivedStats?.completionRate || 0}%`} label="Completion" color="text-emerald-500" bgColor="bg-emerald-500/10" />
            </div>
          )}

          {/* About */}
          {profile.about && (
            <Card className="mb-8 bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownRenderer content={profile.about} />
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="overview" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="animelist" className="gap-2">
                <ListPlus className="w-4 h-4" />
                Anime List
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

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Top Genres */}
              {stats?.genres && stats.genres.length > 0 && (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Top Genres</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {stats.genres.slice(0, 10).map((genre) => (
                        <Badge key={genre.genre} variant="secondary" className="py-1.5 px-3">
                          {genre.genre}
                          <span className="ml-2 text-muted-foreground">({genre.count})</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Favorite Anime */}
              {profile.favourites?.anime?.nodes && profile.favourites.anime.nodes.length > 0 && (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="w-5 h-5 text-destructive" />
                      Favorite Anime
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {profile.favourites.anime.nodes.slice(0, 10).map((anime: any, index: number) => (
                        <AnimeCard key={anime.id} anime={anime} index={index} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Anime List Tab */}
            <TabsContent value="animelist">
              <div className="space-y-4">
                {/* Status Filter */}
                <div className="flex flex-wrap gap-2">
                  {['CURRENT', 'COMPLETED', 'PLANNING', 'PAUSED', 'DROPPED'].map((status) => (
                    <Button
                      key={status}
                      variant={animeListStatus === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAnimeListStatus(status)}
                    >
                      {status === 'CURRENT' ? 'Watching' : status.charAt(0) + status.slice(1).toLowerCase()}
                    </Button>
                  ))}
                </div>

                {isAnimeListLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <AnimeCardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {animeList?.lists?.find((l: any) => l.status === animeListStatus)?.entries?.map((entry: any, index: number) => (
                      <div key={entry.id} className="relative">
                        {entry.media && <AnimeCard anime={entry.media} index={index} />}
                        {entry.score > 0 && (
                          <Badge className="absolute top-2 right-2 bg-primary/90">
                            <Star className="w-3 h-3 mr-1" />
                            {entry.score}
                          </Badge>
                        )}
                      </div>
                    )) || (
                      <p className="col-span-full text-center text-muted-foreground py-8">
                        No anime in this list
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              {profile.favourites?.anime?.nodes && profile.favourites.anime.nodes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {profile.favourites.anime.nodes.map((anime: any, index: number) => (
                    <AnimeCard key={anime.id} anime={anime} index={index} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  No favorite anime
                </p>
              )}
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-8">
              {stats?.scores && stats.scores.length > 0 && (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader><CardTitle className="text-lg">Score Distribution</CardTitle></CardHeader>
                  <CardContent><ScoreDistributionChart data={stats.scores} /></CardContent>
                </Card>
              )}
              {stats?.statuses && stats.statuses.length > 0 && (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader><CardTitle className="text-lg">Status Distribution</CardTitle></CardHeader>
                  <CardContent><StatusDistributionChart data={stats.statuses} /></CardContent>
                </Card>
              )}
              {stats?.genres && stats.genres.length > 0 && (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader><CardTitle className="text-lg">Top Genres</CardTitle></CardHeader>
                  <CardContent><GenreDistributionChart data={stats.genres} /></CardContent>
                </Card>
              )}
              {stats?.formats && stats.formats.length > 0 && (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader><CardTitle className="text-lg">Format Distribution</CardTitle></CardHeader>
                  <CardContent><FormatDistributionChart data={stats.formats} /></CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.map((act) => (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 bg-card/50 backdrop-blur border border-border/50 rounded-lg p-3"
                    >
                      {act.media?.coverImage?.medium && (
                        <Link to={`/anime/${act.media.id}`} className="shrink-0">
                          <img src={act.media.coverImage.medium} alt="" className="w-12 h-16 object-cover rounded" />
                        </Link>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="capitalize">{act.status?.toLowerCase()}</span>
                          {act.progress && ` ${act.progress}`}{' '}
                          <Link to={`/anime/${act.media?.id}`} className="font-medium hover:text-primary transition-colors">
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
                <p className="text-center text-muted-foreground py-12">
                  No recent activity
                </p>
              )}
            </TabsContent>
          </Tabs>

          {/* Followers/Following Modal */}
          {profileId && (
            <FollowersModal
              userId={profileId}
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

function QuickStatCard({ icon: Icon, value, label, color, bgColor }: { 
  icon: typeof Clock; value: string | number; label: string; color: string; bgColor: string;
}) {
  return (
    <div className={`${bgColor} border border-border/50 p-3 rounded-xl text-center transition-transform hover:scale-105`}>
      <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
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
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
