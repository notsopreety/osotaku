import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/seo';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEO 
        title="Page Not Found" 
        description="The page you're looking for doesn't exist. Browse our anime collection to find what you're looking for."
        noindex
      />
      
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: 'hsl(var(--primary))' }}
          />
          <div 
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{ background: 'hsl(var(--secondary))' }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-4 max-w-xl mx-auto">
          {/* 404 Text */}
          <div className="mb-6">
            <h1 className="text-[120px] md:text-[160px] font-black gradient-text leading-none">
              404
            </h1>
          </div>

          {/* Message */}
          <div className="space-y-3 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track!
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Button asChild size="lg" className="gap-2 min-w-[140px]">
              <Link to="/">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="gap-2 min-w-[140px]">
              <Link to="/browse">
                <Search className="w-4 h-4" />
                Browse Anime
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              className="gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>

          {/* Quick links */}
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Quick links:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: 'Trending', sort: 'TRENDING_DESC' },
                { label: 'Popular', sort: 'POPULARITY_DESC' },
                { label: 'Top Rated', sort: 'SCORE_DESC' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={`/browse?sort=${item.sort}`}
                  className="px-4 py-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
