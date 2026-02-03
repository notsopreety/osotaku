import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, ChevronLeft, ChevronRight, Calendar, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Media } from '@/types/anime';
import { cn } from '@/lib/utils';

interface HeroCarouselProps {
  anime: Media[];
  isLoading?: boolean;
}

export function HeroCarousel({ anime, isLoading }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const validAnime = anime.filter((a) => a.bannerImage);
  const displayAnime = validAnime.slice(0, 5);

  const goToNext = useCallback(() => {
    if (displayAnime.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % displayAnime.length);
  }, [displayAnime.length]);

  const goToPrev = useCallback(() => {
    if (displayAnime.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + displayAnime.length) % displayAnime.length);
  }, [displayAnime.length]);

  useEffect(() => {
    if (!isAutoPlaying || displayAnime.length <= 1) return;
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, displayAnime.length]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setIsAutoPlaying(true);
  };

  if (isLoading) {
    return (
      <div className="relative h-[70vh] min-h-[500px] max-h-[800px]">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (displayAnime.length === 0) return null;

  const currentAnime = displayAnime[currentIndex];
  const title = currentAnime.title?.english || currentAnime.title?.romaji || 'Unknown';

  return (
    <div
      ref={containerRef}
      className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden touch-pan-y"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAnime.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={currentAnime.bannerImage || currentAnime.coverImage?.extraLarge}
            alt={title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAnime.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl"
            >
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                {currentAnime.averageScore && (
                  <div className="flex items-center gap-1.5 bg-primary px-3 py-1.5 rounded-full text-sm font-bold text-primary-foreground">
                    <Star className="w-4 h-4 fill-current" />
                    {(currentAnime.averageScore / 10).toFixed(1)}
                  </div>
                )}
                
                {currentAnime.format && (
                  <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                    <Tv className="w-4 h-4" />
                    {currentAnime.format.replace('_', ' ')}
                  </div>
                )}
                
                {currentAnime.status === 'RELEASING' && (
                  <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-sm font-bold text-secondary-foreground">
                    <span className="w-2 h-2 bg-current rounded-full" />
                    Airing
                  </div>
                )}
                
                {currentAnime.seasonYear && (
                  <div className="hidden sm:flex items-center gap-1.5 bg-muted/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    {currentAnime.season} {currentAnime.seasonYear}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {title}
              </h1>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {currentAnime.genres?.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="text-xs sm:text-sm px-3 py-1 rounded-full bg-muted/60 backdrop-blur-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-6 max-w-xl">
                {currentAnime.description?.replace(/<[^>]*>/g, '')}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button size="lg" className="gap-2 rounded-full px-5 sm:px-6" asChild>
                  <Link to={`/anime/${currentAnime.id}`}>
                    <Play className="w-5 h-5 fill-current" />
                    <span className="hidden sm:inline">Watch Now</span>
                    <span className="sm:hidden">Watch</span>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 rounded-full px-5 sm:px-6" asChild>
                  <Link to={`/anime/${currentAnime.id}`}>
                    <Info className="w-5 h-5" />
                    <span className="hidden sm:inline">Details</span>
                    <span className="sm:hidden">Info</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      {displayAnime.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/80"
            onClick={goToPrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/80"
            onClick={goToNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Progress Dots */}
      {displayAnime.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {displayAnime.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-foreground/30 hover:bg-foreground/50'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
