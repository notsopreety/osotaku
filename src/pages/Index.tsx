import { HeroCarousel, AnimeRow } from '@/components/anime';
import { useHomepageData } from '@/hooks/useAnime';
import { SEO, JsonLd, websiteJsonLd } from '@/components/seo';
import { Flame, Tv, Star, Sparkles, Clock } from 'lucide-react';

const Index = () => {
  const { data, isLoading } = useHomepageData();

  return (
    <>
      <SEO />
      <JsonLd data={websiteJsonLd} />
      <div className="min-h-screen">
        <HeroCarousel 
          anime={data?.trending || []} 
          isLoading={isLoading} 
        />

        <div className="space-y-4 pb-8">
          <AnimeRow
            title="Trending Now"
            icon={<Flame className="w-5 h-5 text-primary" />}
            anime={data?.trending || []}
            isLoading={isLoading}
            viewAllHref="/browse?sort=TRENDING_DESC"
          />

          <AnimeRow
            title="Popular This Season"
            icon={<Tv className="w-5 h-5 text-secondary" />}
            anime={data?.thisSeason || []}
            isLoading={isLoading}
            viewAllHref="/seasonal"
          />

          <AnimeRow
            title="All-Time Popular"
            icon={<Sparkles className="w-5 h-5 text-anime-pink" />}
            anime={data?.popular || []}
            isLoading={isLoading}
            viewAllHref="/browse?sort=POPULARITY_DESC"
          />

          <AnimeRow
            title="Top Rated"
            icon={<Star className="w-5 h-5 text-anime-orange" />}
            anime={data?.topRated || []}
            isLoading={isLoading}
            viewAllHref="/browse?sort=SCORE_DESC"
          />

          <AnimeRow
            title="Recently Updated"
            icon={<Clock className="w-5 h-5 text-anime-cyan" />}
            anime={data?.recentlyUpdated || []}
            isLoading={isLoading}
            viewAllHref="/browse?status=RELEASING"
          />
        </div>
      </div>
    </>
  );
};

export default Index;
